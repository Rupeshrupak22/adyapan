import crypto from 'crypto';
import { Resend } from 'resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function clean(value?: unknown) {
  return String(value ?? '').trim();
}

function escapeHtml(value?: unknown) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getResendConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);
  const fromEmail = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';
  const fromName = clean(process.env.RESEND_FROM_NAME) || 'Adyapan School';

  if (!apiKey || apiKey === 'ADD_NEW_RESEND_API_KEY_HERE') return null;
  return { apiKey, from: `${fromName} <${fromEmail}>` };
}

export function createEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return {
    token,
    tokenHash: hashEmailVerificationToken(token),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export function hashEmailVerificationToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getEmailVerificationUrl(token: string, requestOrigin?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin || APP_URL;
  return `${baseUrl.replace(/\/$/, '')}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export async function sendEmailVerificationEmail({
  name,
  email,
  verificationUrl,
}: {
  name: string;
  email: string;
  verificationUrl: string;
}): Promise<boolean> {
  const config = getResendConfig();
  if (!config) {
    console.warn('[EmailVerification] RESEND_API_KEY not configured.');
    return false;
  }

  const safeName = escapeHtml(name);
  const safeVerificationUrl = escapeHtml(verificationUrl);
  const subject = 'Verify your Adyapan email';
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
  <tr>
    <td style="background:linear-gradient(135deg,#ffa800 0%,#ff6b00 100%);padding:36px 40px 30px;text-align:center;">
      <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:800;">Verify Your Email</h1>
      <p style="margin:0;color:rgba(255,255,255,0.9);font-size:15px;">This secure link is valid for 24 hours.</p>
    </td>
  </tr>
  <tr><td style="padding:34px 40px 0;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Hi ${safeName},</p>
    <p style="margin:0 0 26px;font-size:14px;color:#6b7280;line-height:1.7;">
      Please confirm this email address before signing in to your Adyapan account.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#ffa800,#ff6b00);box-shadow:0 4px 20px rgba(255,107,0,0.35);">
          <a href="${safeVerificationUrl}" style="display:inline-block;padding:15px 36px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">Verify Email</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 18px;font-size:13px;color:#6b7280;line-height:1.7;">If the button does not work, copy and paste this link into your browser:</p>
    <p style="margin:0 0 28px;word-break:break-all;font-size:12px;color:#ea580c;line-height:1.6;">${safeVerificationUrl}</p>
    <p style="margin:0 0 34px;font-size:13px;color:#9ca3af;line-height:1.7;">If you did not create this account, you can safely ignore this email.</p>
  </td></tr>
  <tr>
    <td style="background:#1a1a2e;padding:22px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ffa800;">Adyapan Skills</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">&copy; ${new Date().getFullYear()} Adyapan Skills &middot; All rights reserved</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Hi ${name},

Please verify your Adyapan account email:
${verificationUrl}

This link is valid for 24 hours. If you did not create this account, you can ignore this email.

Adyapan Skills Team`;

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from,
      to: email,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('[EmailVerification] Resend error:', result.error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[EmailVerification] Resend failed:', err?.message);
    return false;
  }
}
