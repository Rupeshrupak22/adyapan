/**
 * Adyapan - Resend Email Service
 * Handles payment, certificate, and welcome emails.
 */

import { Resend } from 'resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';

const fmt = (n: number) =>
  'Rs. ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

function clean(value?: unknown) {
  return String(value ?? '').trim();
}

function getResendConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);
  const fromEmail = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';
  const fromName = clean(process.env.RESEND_FROM_NAME) || 'Adyapan';

  if (!apiKey || apiKey === 'ADD_NEW_RESEND_API_KEY_HERE') return null;
  return { apiKey, from: `${fromName} <${fromEmail}>` };
}

/* â"€â"€ Course metadata â"€â"€ */
const COURSE_META: Record<string, { modules: string[]; benefits: string[]; duration: string }> = {
  'plan-1': {
    duration: '30 Days',
    modules: ['Month 1 - Industry Training', 'Course Completion Certificate', 'Project Certificate'],
    benefits: ['Month 1 - Industry Training', 'Course Completion Certificate', 'Project Certificate'],
  },
  'plan-2': {
    duration: '45 Days',
    modules: ['45 Days - Industry Training', 'Live Project Allotment', 'Assessment & Certification'],
    benefits: ['45 Days - Industry Training', 'Live Project Allotment', 'Course Completion Certificate', 'Internship Completion Certificate', 'Best Performance Certificate'],
  },
  'plan-3': {
    duration: '3 Months',
    modules: ['Month 1 - Industry Training', 'Month 2 - Minor & Major Projects', 'Month 3 - Resume Building + Mock Interviews'],
    benefits: ['Month 1 - Industry Training', 'Month 2 - Minor & Major Projects', 'Month 3 - Resume Building + Mock Interviews', 'Project Completion Certificate', 'Internship Completion Certificate', 'Course Completion Certificate', 'Best Performance Certificate'],
  },
  'plan-4-premium': {
    duration: '4 Months',
    modules: ['Months 1-3 - Training + Minor & Major Industry Projects', 'Month 4 (Offline) - Resume Building', 'Mock Interviews', 'Interview Training'],
    benefits: ['Months 1-3 - Training + Minor & Major Industry Projects', 'Month 4 (Offline) - Resume Building', 'Mock Interviews', 'Interview Training', 'Stipend up to Rs. 15,000', 'Experience Certificate', 'Resume Referrals', 'Company References', 'Guaranteed Job Support Until Placement'],
  },
};

const DEFAULT_META = {
  duration: 'As per plan',
  modules: ['Core Curriculum', 'Practical Projects', 'Expert Sessions', 'Assessment & Certification'],
  benefits: ['Industry-recognised certificate', 'Live classes', 'Study material', 'Placement support'],
};

async function sendViaResend(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const config = getResendConfig();
  if (!config) {
    console.warn('[Email] Resend not configured. Set RESEND_API_KEY in .env');
    return false;
  }

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('[Email] Resend error:', result.error);
      return false;
    }

    console.log(`[Email] Sent via Resend to ${to} | Subject: ${subject}`);
    return true;
  } catch (err: any) {
    console.error('[Email] Resend failed:', err?.message);
    return false;
  }
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUCCESS EMAIL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export interface SuccessEmailPayload {
  name: string;
  email: string;
  courseName: string;
  courseSlug: string;
  planLabel: string;
  amount: number;
  paymentId: string;
  orderId: string;
}

export async function sendPaymentSuccessEmail(p: SuccessEmailPayload): Promise<boolean> {
  const meta = COURSE_META[p.courseSlug] || DEFAULT_META;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const moduleRows = meta.modules.map((m, i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#374151;">
          <span style="width:24px;height:24px;background:#fff7ed;border:1px solid #fed7aa;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#ea580c;flex-shrink:0;">${i + 1}</span>
          ${m}
        </span>
      </td>
    </tr>`).join('');

  const benefitRows = meta.benefits.map(b => `
    <tr>
      <td style="padding:6px 0;">
        <span style="font-size:14px;color:#374151;">
          <span style="color:#16a34a;margin-right:8px;">&#10003;</span>${b}
        </span>
      </td>
    </tr>`).join('');

  const receiptRows = [
    ['Plan', p.planLabel || p.courseName],
    ['Course', p.courseName],
    ['Duration', meta.duration],
    ['Amount Paid', fmt(p.amount)],
    ['Payment ID', p.paymentId],
    ['Order ID', p.orderId],
    ['Date', date],
    ['Status', '&#10003; Confirmed'],
  ].map(([k, v]) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
      </tr>
    </table>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:36px;">&#127881;</div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Payment Successful!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Welcome to Adyapan Skills - your learning journey begins now</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      Congratulations! Your payment has been successfully processed and you are now officially enrolled in
      <strong style="color:#ea580c;">${p.courseName}</strong>. Get ready to learn, build, and get placed!
    </p>

    <!-- RECEIPT -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">Payment Receipt</p>
        ${receiptRows}
      </td></tr>
    </table>

    <!-- MODULES -->
    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">Course Modules</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${moduleRows}</table>
      </td></tr>
    </table>

    <!-- BENEFITS -->
    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">What You Get</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${benefitRows}</table>
      </td></tr>
    </table>

    <!-- NEXT STEPS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:32px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e40af;">What happens next?</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
          <li>Our team will contact you within <strong>24 hours</strong> with batch details.</li>
          <li>Check your dashboard for course schedule and materials.</li>
          <li>Join our student WhatsApp group for live updates.</li>
          <li>Attend your first live class and start your journey!</li>
        </ul>
      </td></tr>
    </table>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${APP_URL}/dashboard/student" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Go to My Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
      Questions? Email us at <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">SR's Adyapan Edutech Private Limited</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">
        &copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved &middot;
        <a href="${APP_URL}/privacy" style="color:#6b7280;">Privacy Policy</a>
      </p>
    </td>
  </tr>

</table>
<p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center;">You received this because you made a purchase on Adyapan Skills.</p>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name},

Payment Successful! Congratulations!

You are now enrolled in ${p.courseName} (${p.planLabel}).

Receipt:
- Amount Paid: ${fmt(p.amount)}
- Duration: ${meta.duration}
- Payment ID: ${p.paymentId}
- Order ID: ${p.orderId}
- Date: ${date}
- Status: Confirmed

Course Modules:
${meta.modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

What You Get:
${meta.benefits.map(b => `- ${b}`).join('\n')}

Go to your dashboard: ${APP_URL}/dashboard/student

Questions? Email: support@adyapan.com

- Adyapan Skills Team`;

  const subject = `Payment Confirmed - ${p.courseName} | Adyapan Skills`;
  return sendViaResend(p.email, subject, html, text);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FAILURE EMAIL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export interface FailureEmailPayload {
  name: string;
  email: string;
  courseName: string;
  courseSlug: string;
  planLabel: string;
  amount: number;
  orderId: string;
  failureReason?: string;
  retryUrl?: string;
}

export async function sendPaymentFailureEmail(p: FailureEmailPayload): Promise<boolean> {
  const retryLink = p.retryUrl || `${APP_URL}/checkout?plan=${p.courseSlug}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:40px 40px 32px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 20px;line-height:72px;font-size:36px;text-align:center;">&#10060;</div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Payment Failed</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Don't worry - your money is safe. Please try again.</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      We're sorry, but your payment for <strong style="color:#dc2626;">${p.courseName}</strong> could not be processed.
      No amount has been deducted from your account. Please try again using the button below.
    </p>

    <!-- DETAILS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:1px;">Payment Details</p>
        ${[
          ['Course', p.courseName],
          ['Plan', p.planLabel || p.courseName],
          ['Amount', fmt(p.amount)],
          ['Order ID', p.orderId],
          ['Date', date],
          ['Status', '&#10060; Failed'],
          ...(p.failureReason ? [['Reason', p.failureReason]] : []),
        ].map(([k, v]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
            <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>

    <!-- TIPS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:32px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#92400e;">Common reasons for payment failure:</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:2.2;">
          <li>Insufficient balance in your account</li>
          <li>Bank declined the transaction</li>
          <li>Network timeout during payment</li>
          <li>Incorrect OTP or card details</li>
          <li>Daily transaction limit exceeded</li>
        </ul>
      </td></tr>
    </table>

    <!-- RETRY CTA -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${retryLink}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Retry Payment &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 36px;font-size:13px;color:#9ca3af;text-align:center;">
      If the issue persists, contact us at
      <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">SR's Adyapan Edutech Private Limited</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">
        &copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name},

Payment Failed for ${p.courseName}.

Don't worry - no amount has been deducted from your account.

Details:
- Course: ${p.courseName}
- Amount: ${fmt(p.amount)}
- Order ID: ${p.orderId}
- Date: ${date}
${p.failureReason ? `- Reason: ${p.failureReason}` : ''}

Retry your payment: ${retryLink}

Need help? Email: support@adyapan.com

- Adyapan Skills Team`;

  const subject = `Payment Failed - ${p.courseName} | Adyapan Skills`;
  return sendViaResend(p.email, subject, html, text);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CERTIFICATE READY EMAIL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export interface CertificateEmailPayload {
  name: string;
  email: string;
  courseName: string;
  courseSlug: string;
  certificateId: string;
  issuedAt: Date;
}

export async function sendCertificateReadyEmail(p: CertificateEmailPayload): Promise<boolean> {
  const date = new Date(p.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const downloadUrl = `${APP_URL}/api/certificates/${p.courseSlug}/download`;
  const dashboardUrl = `${APP_URL}/dashboard/student`;
  const linkedinUrl = 'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all';
  const isLocal = !APP_URL || APP_URL.includes('localhost') || APP_URL.includes('127.0.0.1');
  const linkedinIconUrl = isLocal
    ? 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
    : `${APP_URL}/linkedin-icon.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;"></div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Congratulations!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Your certificate is ready to download</p>
    </td>
  </tr>
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      You have successfully completed <strong style="color:#ea580c;">${p.courseName}</strong>!
      Your certificate of completion is now ready. Download it and share your achievement with the world.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;">Certificate Details</p>
        ${[
          ['Certificate ID', p.certificateId],
          ['Student Name', p.name],
          ['Course', p.courseName],
          ['Issue Date', date],
          ['Status', ' Ready'],
        ].map(([k, v]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          <tr>
            <td style="font-size:13px;color:#9ca3af;width:42%;">${k}</td>
            <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;">${v}</td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${downloadUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Download Certificate &rarr;
          </a>
        </td>
      </tr>
    </table>
    <p style="text-align:center;margin:0 0 32px;">
      <a href="${dashboardUrl}" style="font-size:13px;color:#ea580c;font-weight:600;">View in Dashboard</a>
    </p>
    <!-- LINKEDIN NOTE / SHARE ON LINKEDIN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fd;border:1px solid #cbe2fb;border-left:5px solid #0a66c2;border-radius:12px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 22px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle" style="width:44px;padding-right:14px;">
                <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;" title="Adyapan on LinkedIn">
                  <img src="${linkedinIconUrl}" alt="LinkedIn" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:8px;border:0;outline:none;" />
                </a>
              </td>
              <td valign="middle">
                <span style="display:inline-block;background:#0a66c2;color:#ffffff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:0.7px;text-transform:uppercase;">
                  NOTE &bull; SHARE YOUR ACHIEVEMENT
                </span>
                <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#0a66c2;line-height:1.3;">
                  Share your certificate on LinkedIn &amp; tag Adyapan!
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:13px 0 14px;font-size:13px;color:#374151;line-height:1.75;">
            Celebrate your achievement with your professional network! Post your certificate on LinkedIn, share your learning journey, and tag <strong>@Adyapan Edutech Pvt. Ltd.</strong> so we can celebrate your success and feature you on our official page.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
            <tr>
              <td style="border-radius:8px;background:#0a66c2;box-shadow:0 3px 10px rgba(10,102,194,0.25);">
                <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 22px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                  Post &amp; Tag Adyapan on LinkedIn &rarr;
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
            💡 <strong>Pro Tip:</strong> Mention <strong>@Adyapan Edutech Pvt. Ltd.</strong> and add <strong>#Adyapan #Certified #Upskilling #Achievement</strong> to your post.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
      Share your achievement on LinkedIn and tag <strong>@AdyapanSkills</strong>!<br/>
      Questions? Email us at <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">&copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name},

Congratulations! You have completed ${p.courseName}.

Your certificate is ready:
- Certificate ID: ${p.certificateId}
- Issue Date: ${date}

Download: ${downloadUrl}
Dashboard: ${dashboardUrl}

NOTE - SHARE ON LINKEDIN
Post your certificate on LinkedIn and tag @Adyapan Edutech Pvt. Ltd.!
Open LinkedIn: ${linkedinUrl}

- Adyapan Skills Team`;

  const subject = `Your Certificate is Ready - ${p.courseName} | Adyapan Skills`;
  return sendViaResend(p.email, subject, html, text);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WELCOME EMAIL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export interface WelcomeEmailPayload {
  name: string;
  email: string;
  role: 'student' | 'organization';
}

export async function sendWelcomeEmail(p: WelcomeEmailPayload): Promise<boolean> {
  const dashboardUrl = p.role === 'organization' ? `${APP_URL}/admin` : `${APP_URL}/dashboard/student`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;"></div>
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Welcome to Adyapan!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.88);font-size:15px;">Your account has been created successfully</p>
    </td>
  </tr>
  <tr><td style="padding:36px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${p.name},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      Welcome to <strong style="color:#ea580c;">Adyapan Skills</strong>! Your account is ready.
      ${p.role === 'student'
        ? 'Explore our courses, enroll in a program, and start your learning journey today.'
        : 'Your organization portal is ready. Manage students, courses, and payments from your dashboard.'}
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${dashboardUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
            Go to Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 36px;font-size:14px;color:#374151;line-height:1.7;">
      Questions? Email us at <a href="mailto:support@adyapan.com" style="color:#ea580c;font-weight:600;">support@adyapan.com</a>
    </p>
  </td></tr>
  <tr>
    <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">&copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${p.name}, welcome to Adyapan Skills! Your account is ready. Visit: ${dashboardUrl}`;

  const subject = 'Welcome to Adyapan Skills!';
  return sendViaResend(p.email, subject, html, text);
}

/* ══════════════════════════════════════════════════════════════
   ADMIN — SEND CERTIFICATE EMAIL (manual, from admin panel)
   Sends the official certificate email with the uploaded file(s)
   attached, matching the approved Adyapan template.
══════════════════════════════════════════════════════════════ */
export interface AdminCertificateEmailAttachment {
  filename: string;
  content: Buffer;   // raw file bytes
}

export interface AdminCertificateEmailPayload {
  name: string;
  email: string;
  courseName: string;
  certificateId: string;
  issuedAt: Date | string;
  verifyUrl?: string;
  attachments?: AdminCertificateEmailAttachment[];
}

export async function sendAdminCertificateEmail(p: AdminCertificateEmailPayload): Promise<boolean> {
  const config = getResendConfig();
  if (!config) {
    console.warn('[Email] Resend not configured. Set RESEND_API_KEY in .env');
    return false;
  }

  const verifyUrl = p.verifyUrl || `${APP_URL}/verify-certificate`;
  const date = new Date(p.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const logoUrl = `${APP_URL}/adyapan-logo.png`;
  const linkedinUrl = 'https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all';
  const isLocal = !APP_URL || APP_URL.includes('localhost') || APP_URL.includes('127.0.0.1');
  const linkedinIconUrl = isLocal
    ? 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
    : `${APP_URL}/linkedin-icon.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#eef0f3;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- LOGO BAND -->
  <tr>
    <td style="padding:26px 40px 22px;text-align:center;border-bottom:1px solid #f0f0f0;">
      <img src="${logoUrl}" alt="Adyapan Edutech Pvt. Ltd." width="190" style="display:inline-block;width:190px;max-width:70%;height:auto;border:0;outline:none;text-decoration:none;" />
    </td>
  </tr>

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:30px 40px;text-align:center;">
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:23px;font-weight:700;letter-spacing:0.3px;">Congratulations, ${p.name}!</h1>
      <p style="margin:0;color:rgba(255,255,255,0.92);font-size:14px;">Your official certificate from Adyapan Edutech Pvt. Ltd.</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr><td style="padding:34px 40px 8px;">
    <p style="margin:0 0 18px;font-size:15px;color:#1f2937;">Dear <strong>${p.name}</strong>,</p>

    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.9;">
      Warm greetings from <strong>Adyapan Edutech Pvt. Ltd.</strong>
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.9;">
      Congratulations on successfully completing your program. We are pleased to share your
      <strong>official certificate</strong> issued by <strong>Adyapan Edutech Pvt. Ltd.</strong>,
      in recognition of your successful completion, participation, and efforts throughout the program.
    </p>

    <p style="margin:0 0 26px;font-size:14px;color:#4b5563;line-height:1.9;">
      Please find your certificate attached to this email. We recommend keeping a digital copy safely
      for your future academic, professional, internship, and career-related requirements.
    </p>

    <!-- CERTIFICATE DETAILS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:10px;margin-bottom:26px;">
      <tr><td style="padding:4px 22px;">
        ${[
          ['Certificate ID', p.certificateId],
          ['Name', p.name],
          ['Program', p.courseName],
          ['Issue Date', date],
        ].map(([k, v], i, arr) => `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:14px 0;font-size:13px;color:#9ca3af;${i < arr.length - 1 ? 'border-bottom:1px solid #f3f3f3;' : ''}">${k}</td>
            <td style="padding:14px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;${i < arr.length - 1 ? 'border-bottom:1px solid #f3f3f3;' : ''}">${v}</td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>

    <!-- VERIFY -->
    <p style="margin:0 0 10px;font-size:14px;color:#4b5563;line-height:1.9;">
      Your certificate can be verified online at any time through the official
      Adyapan Certificate Verification Portal:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="border-radius:8px;background:linear-gradient(135deg,#ffa800,#ff6b00);">
        <a href="${verifyUrl}" style="display:inline-block;padding:13px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
          Verify Certificate
        </a>
      </td></tr>
    </table>

    <!-- LINKEDIN NOTE / SHARE ON LINKEDIN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fd;border:1px solid #cbe2fb;border-left:5px solid #0a66c2;border-radius:12px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 22px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle" style="width:44px;padding-right:14px;">
                <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;" title="Adyapan on LinkedIn">
                  <img src="${linkedinIconUrl}" alt="LinkedIn" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:8px;border:0;outline:none;" />
                </a>
              </td>
              <td valign="middle">
                <span style="display:inline-block;background:#0a66c2;color:#ffffff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:0.7px;text-transform:uppercase;">
                  NOTE &bull; SHARE YOUR ACHIEVEMENT
                </span>
                <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#0a66c2;line-height:1.3;">
                  Share your certificate on LinkedIn &amp; tag Adyapan!
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:13px 0 14px;font-size:13px;color:#374151;line-height:1.75;">
            Celebrate your achievement with your professional network! Post your certificate on LinkedIn, share your learning journey, and tag <strong>@Adyapan Edutech Pvt. Ltd.</strong> so we can celebrate your success and feature you on our official page.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
            <tr>
              <td style="border-radius:8px;background:#0a66c2;box-shadow:0 3px 10px rgba(10,102,194,0.25);">
                <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 22px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                  Post &amp; Tag Adyapan on LinkedIn &rarr;
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
            💡 <strong>Pro Tip:</strong> Mention <strong>@Adyapan Edutech Pvt. Ltd.</strong> and add <strong>#Adyapan #Certified #Upskilling #Achievement</strong> to your post.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.9;">
      We truly appreciate your dedication, participation, and commitment throughout the learning journey.
      We hope the knowledge and experience gained through this program will support you in achieving your
      academic and professional goals.
    </p>

    <p style="margin:0 0 26px;font-size:14px;color:#4b5563;line-height:1.9;">
      Once again, congratulations on your achievement. We wish you continued success, growth, and many
      more accomplishments in the future.
    </p>

    <!-- SIGNATURE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0f0f0;margin-top:8px;">
      <tr><td style="padding:22px 0 36px;">
        <p style="margin:0 0 4px;font-size:14px;color:#4b5563;">Warm Regards,</p>
        <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#111827;">Team Adyapan Edutech Pvt. Ltd.</p>
        <p style="margin:0;font-size:13px;color:#6b7280;">
          <a href="${APP_URL}" style="color:#ea580c;text-decoration:none;">www.adyapan.com</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:support@adyapan.com" style="color:#ea580c;text-decoration:none;">support@adyapan.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a2e;padding:28px 40px;text-align:center;">
      <img src="${logoUrl}" alt="Adyapan Edutech Pvt. Ltd." width="170" style="display:inline-block;width:170px;max-width:60%;height:auto;margin-bottom:12px;border:0;outline:none;text-decoration:none;" />
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
        <a href="${APP_URL}" style="color:#9ca3af;text-decoration:none;">www.adyapan.com</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:support@adyapan.com" style="color:#9ca3af;text-decoration:none;">support@adyapan.com</a>
      </p>
      <p style="margin:0;font-size:11px;color:#6b7280;">&copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Dear ${p.name},

Warm greetings from Adyapan Edutech Pvt. Ltd.

Congratulations on successfully completing your program!

We are pleased to share your official certificate issued by Adyapan Edutech Pvt. Ltd.
in recognition of your successful completion, participation, and efforts throughout the program.

YOUR CERTIFICATE IS ATTACHED
Please find your certificate attached to this email. Keep a digital copy safely for your
future academic, professional, internship, and career-related requirements.

Certificate Details:
- Certificate ID: ${p.certificateId}
- Name: ${p.name}
- Program: ${p.courseName}
- Issue Date: ${date}

VERIFY YOUR CERTIFICATE
Verify online: ${verifyUrl}

NOTE - SHARE YOUR ACHIEVEMENT ON LINKEDIN
Celebrate your achievement with your professional network! Post your certificate on LinkedIn and tag @Adyapan Edutech Pvt. Ltd. so we can celebrate your journey together.
Open LinkedIn & Tag Us: ${linkedinUrl}
Pro Tip: Mention @Adyapan Edutech Pvt. Ltd. and use #Adyapan #Certified #Upskilling

We truly appreciate your dedication, participation, and commitment throughout the learning journey.

Once again, congratulations on your achievement!

Warm Regards,
Adyapan Edutech Pvt. Ltd.
www.adyapan.com
support@adyapan.com

Learn - Grow - Achieve`;

  const subject = `Congratulations! Your Certificate is Ready`;

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from,
      to: p.email,
      subject,
      html,
      text,
      ...(p.attachments && p.attachments.length > 0
        ? { attachments: p.attachments.map(a => ({ filename: a.filename, content: a.content })) }
        : {}),
    });

    if (result.error) {
      console.error('[Email] Admin certificate send error:', result.error);
      return false;
    }
    console.log(`[Email] Admin certificate sent to ${p.email} | Cert: ${p.certificateId}`);
    return true;
  } catch (err: any) {
    console.error('[Email] Admin certificate send failed:', err?.message);
    return false;
  }
}
