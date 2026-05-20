/**
 * POST /api/payment/verify
 *
 * Verifies Razorpay payment signature and persists the full payment flow:
 *   1. Verify HMAC SHA256 signature (NEVER trust frontend)
 *   2. Idempotency check
 *   3. Save Payment record (critical - throws on failure)
 *   4. Create Enrollment + init Progress (critical)
 *   5. Send success email + save EmailLog
 *
 * If any critical DB save fails → return 500, do NOT return success.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { requireJwtSecret, sanitizeMongoInput } from '@/lib/security';
import {
  savePayment,
  createEnrollmentWithProgress,
  logEmail,
  wasEmailSent,
} from '@/lib/db-service';
import { sendPaymentSuccessEmail } from '@/lib/email';
import Payment from '@/models/Payment';
import AuthUser from '@/models/AuthUser';
import { getPlan } from '@/lib/planData';
import { getDynamicPlanDates, parseDuration, formatCurrentTimeIST } from '@/lib/dateUtils';

const PLAN_SLUGS: Record<string, string> = {
  'plan-1':         'Adyapan Starter',
  'plan-2':         'Adyapan Standard',
  'plan-3':         'Adyapan Professional',
  'plan-4-premium': 'Adyapan Career Pro',
};

/**
 * Authoritative plan prices (INR, GST included) - server-side source of truth.
 * Must stay in sync with PLAN_AMOUNTS in /api/payment/create-order/route.ts
 * and PLAN_DATA in /lib/planData.ts.
 * NEVER trust the grandTotal sent by the frontend.
 */
const PLAN_BASE_PRICES: Record<string, number> = {
  'plan-1':         3000,
  'plan-2':         3500,
  'plan-3':         5000,
  'plan-4-premium': 15000,
};

const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  ADYAPAN5:  { type: 'percent', value: 5,    label: 'Extra 5% Off' },
  STUDENT10: { type: 'flat',    value: 1000, label: 'Rs. 1,000 Off' },
  CAREER20:  { type: 'percent', value: 20,   label: '20% Off Premium' },
};

function calculatePricing(courseSlug: string, couponCode?: unknown) {
  const basePrice = PLAN_BASE_PRICES[courseSlug];
  if (!basePrice) return null;

  const code = String(couponCode || '').trim().toUpperCase();
  const coupon = code ? COUPONS[code] : null;
  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.round((basePrice * coupon.value) / 100)
      : coupon.value
    : 0;
  const base = parseFloat(Math.max(0, basePrice - couponDiscount).toFixed(2));
  const total = base;

  return {
    originalBase: basePrice,
    couponCode: coupon ? code : '',
    couponDiscount,
    base,
    gst: 0,
    total,
  };
}

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET not configured');
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await req.json());
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      customerPhone,
      planName,
      planLabel,
      grandTotal,
      planKey,
      couponCode,
      paymentMethod = 'upi',
    } = body;

    // ── Validate required fields ──
    if (!razorpay_order_id || !razorpay_payment_id || !customerEmail) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // ── Idempotency: already processed? ──
    const existingPayment = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (existingPayment) {
      console.log(`[Payment] Duplicate: ${razorpay_payment_id} - returning cached success`);
      return NextResponse.json({ success: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id, duplicate: true });
    }

    // ── SECURITY: Verify signature ──
    let signatureValid = false;
    try {
      signatureValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    } catch (err: any) {
      console.error('[Payment] Signature check error:', err?.message);
      return NextResponse.json({ success: false, error: 'Signature verification failed' }, { status: 500 });
    }

    if (!signatureValid) {
      console.warn(`[Payment]  INVALID SIGNATURE - Order: ${razorpay_order_id} | Payment: ${razorpay_payment_id}`);

      // Save failed payment attempt for audit
      const courseSlug = planKey || 'plan-4-premium';
      const courseName = PLAN_SLUGS[courseSlug] || planName || 'Adyapan Course';
      // Use server-side price for the audit record too
      const failedPricing = calculatePricing(courseSlug, couponCode);
      const failedBase = failedPricing?.base ?? 0;
      const failedGst = failedPricing?.gst ?? 0;
      const failedTotal = failedPricing?.total ?? failedBase;
      
      // Calculate dynamic plan dates for failed payment too
      const plan = getPlan(courseSlug);
      const planDates = getDynamicPlanDates(plan.duration, plan.totalDays);
      const { durationMonths, durationDays } = parseDuration(plan.duration, plan.totalDays);
      const currentTimeIST = formatCurrentTimeIST();
      
      await savePayment({
        userId: '', userName: customerName || '', userEmail: customerEmail || '',
        userPhone: customerPhone || '', paymentId: razorpay_payment_id,
        orderId: razorpay_order_id, courseSlug, courseName, planLabel: planLabel || '',
        baseAmount: failedBase, gstAmount: failedGst, totalAmount: failedTotal,
        status: 'failed', failureReason: 'Invalid signature',
        signatureVerified: false, isTestMode: false,
        // Dynamic plan dates and times
        paymentDate: planDates.rawStartDate,
        paymentTime: currentTimeIST,
        courseStartDate: planDates.rawStartDate,
        courseEndDate: planDates.rawEndDate,
        validTill: planDates.rawValidTill,
        durationDays,
        durationMonths,
        selectedPlan: courseSlug,
      }).catch(e => console.warn('[Payment] Failed payment save error:', e?.message));

      return NextResponse.json({ success: false, error: 'Payment verification failed - invalid signature' }, { status: 400 });
    }

    // ── Resolve user from JWT ──
    const token = req.cookies.get('authToken')?.value;
    let userId = '';
    let userName = customerName || '';
    let userEmail = customerEmail || '';
    let userPhone = customerPhone || '';

    if (token) {
      try {
        const decoded = jwt.verify(token, requireJwtSecret()) as { userId: string };
        userId = decoded.userId;
        const dbUser = await AuthUser.findById(userId).lean();
        if (dbUser) {
          userName  = (dbUser as any).name  || userName;
          userEmail = (dbUser as any).email || userEmail;
          userPhone = (dbUser as any).phone || userPhone;
        }
      } catch { /* continue without userId */ }
    }

    const courseSlug = planKey || Object.keys(PLAN_SLUGS).find(k => PLAN_SLUGS[k] === planName) || 'plan-4-premium';
    const courseName = PLAN_SLUGS[courseSlug] || planName || 'Adyapan Course';

    // ── SECURITY: Derive amount server-side - never trust grandTotal from frontend ──
    const pricing = calculatePricing(courseSlug, couponCode);
    if (!pricing) {
      console.error(`[Payment] Unknown planKey: ${courseSlug}`);
      return NextResponse.json({ success: false, error: 'Invalid plan.' }, { status: 400 });
    }
    const { base, gst, total } = pricing;

    // ── Calculate dynamic plan dates ──
    const plan = getPlan(courseSlug);
    const planDates = getDynamicPlanDates(plan.duration, plan.totalDays);
    const { durationMonths, durationDays } = parseDuration(plan.duration, plan.totalDays);
    const currentTimeIST = formatCurrentTimeIST();

    // ── CRITICAL: Save payment (throws on failure) ──
    const payment = await savePayment({
      userId, userName, userEmail, userPhone,
      paymentId: razorpay_payment_id, orderId: razorpay_order_id,
      courseSlug, courseName, planLabel: planLabel || '',
      baseAmount: base, gstAmount: gst, totalAmount: total,
      status: 'success', paymentMethod,
      signatureVerified: true, isTestMode: false,
      paidAt: new Date(),
      // Dynamic plan dates and times
      paymentDate: planDates.rawStartDate,
      paymentTime: currentTimeIST,
      courseStartDate: planDates.rawStartDate,
      courseEndDate: planDates.rawEndDate,
      validTill: planDates.rawValidTill,
      durationDays,
      durationMonths,
      selectedPlan: courseSlug,
    });

    // ── CRITICAL: Create enrollment + progress (if user is logged in) ──
    if (userId) {
      await createEnrollmentWithProgress({
        userId, courseSlug, courseName,
        planId:    courseSlug,
        planLabel: planLabel || '',
        amountPaid: total,
        paymentId: razorpay_payment_id,
        // Dynamic plan dates and times
        paymentDate: planDates.rawStartDate,
        paymentTime: currentTimeIST,
        courseStartDate: planDates.rawStartDate,
        courseEndDate: planDates.rawEndDate,
        validTill: planDates.rawValidTill,
        durationDays,
        durationMonths,
        selectedPlan: courseSlug,
      });
    }

    // ── Send success email (non-critical, but logged) ──
    if (userEmail && userName) {
      const alreadySent = await wasEmailSent('paymentId', razorpay_payment_id, 'payment_success');

      if (!alreadySent) {
        let emailStatus: 'sent' | 'failed' = 'failed';
        let errorMessage = '';
        const provider = 'resend';

        try {
          const sent = await sendPaymentSuccessEmail({
            name: userName, email: userEmail, courseName, courseSlug,
            planLabel: planLabel || '', amount: total,
            paymentId: razorpay_payment_id, orderId: razorpay_order_id,
          });

          if (sent) {
            emailStatus = 'sent';
          } else {
            errorMessage = 'Resend email was not sent. Check RESEND_API_KEY and RESEND_FROM_EMAIL domain verification.';
          }
        } catch (e: any) {
          errorMessage = e?.message || 'Unknown error';
          console.error('[Email] Payment success email failed:', errorMessage);
        }

        await logEmail({
          userId, email: userEmail,
          emailType: 'payment_success',
          subject: `Payment Confirmed - ${courseName}`,
          status: emailStatus, provider,
          errorMessage, paymentId: razorpay_payment_id,
          orderId: razorpay_order_id, courseSlug, courseName, amount: total,
        });
      }
    }

    console.log(`[Payment]  Complete - ${razorpay_payment_id} | ${userEmail} | Rs. ${total}`);

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

  } catch (error: any) {
    console.error('[Payment] Verify critical error:', error?.message);
    // Critical failure - do NOT return success
    return NextResponse.json({ success: false, error: 'Payment processing failed. Please contact support.' }, { status: 500 });
  }
}
