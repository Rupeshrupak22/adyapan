import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/verify-email
 * Verifies an email address using AbstractAPI.
 * Returns { valid: boolean, reason?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { valid: false, reason: 'Email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ABSTRACTAPI_EMAIL_KEY;
    if (!apiKey) {
      // If no API key configured, skip verification (don't block signups)
      console.warn('ABSTRACTAPI_EMAIL_KEY not set " skipping email verification');
      return NextResponse.json({ valid: true });
    }

    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email.trim())}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      // If AbstractAPI is down or rate-limited, don't block the user
      console.error('AbstractAPI error:', response.status, await response.text());
      return NextResponse.json({ valid: true });
    }

    const data = await response.json();

    // AbstractAPI returns:
    // deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN"
    // is_valid_format: { value: boolean }
    // is_disposable_email: { value: boolean }
    // is_smtp_valid: { value: boolean }

    const isFormatValid = data.is_valid_format?.value === true;
    const isDeliverable = data.deliverability === 'DELIVERABLE';
    const isDisposable = data.is_disposable_email?.value === true;
    const isSmtpValid = data.is_smtp_valid?.value === true;

    if (!isFormatValid) {
      return NextResponse.json({
        valid: false,
        reason: 'This email address format is invalid.',
      });
    }

    if (isDisposable) {
      return NextResponse.json({
        valid: false,
        reason: 'Disposable/temporary email addresses are not allowed.',
      });
    }

    if (!isDeliverable && !isSmtpValid) {
      return NextResponse.json({
        valid: false,
        reason: 'This email address does not appear to exist. Please check and try again.',
      });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Email verification error:', error);
    // On any error, don't block the user
    return NextResponse.json({ valid: true });
  }
}
