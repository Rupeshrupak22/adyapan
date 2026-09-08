import { Resend } from 'resend';

export interface LMSAccessNotificationPayload {
  name: string;
  email: string;
  phone?: string;
  lmsProvider: string;
  lmsEmail: string;
  lmsPassword: string;
  lmsPortalLink: string;
  batchName?: string;
  mentorName?: string;
  counselorName?: string;
  supportContact?: string;
}

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

function titleCaseProvider(provider: string) {
  const map: Record<string, string> = {
    moodle: 'Moodle',
    google_classroom: 'Google Classroom',
    teachable: 'Teachable',
    thinkific: 'Thinkific',
    custom: 'Adyapan Learning Platform',
  };
  return map[provider] || provider;
}

function getResendConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);
  const fromEmail = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';
  const fromName = clean(process.env.RESEND_FROM_NAME) || 'Adyapan School';

  if (!apiKey || apiKey === 'ADD_NEW_RESEND_API_KEY_HERE') return null;
  return { apiKey, from: `${fromName} <${fromEmail}>` };
}

export async function sendLMSAccessEmail(p: LMSAccessNotificationPayload): Promise<boolean> {
  const config = getResendConfig();
  if (!config) {
    console.warn('[LMS Email] Resend not configured - skipping LMS access email.');
    return false;
  }

  const providerLabel = titleCaseProvider(p.lmsProvider);
  const support = clean(p.supportContact) || 'support@adyapan.com';
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 14px;background:#f8fafc;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #fed7aa;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:30px;background:linear-gradient(135deg,#111827,#1f2937);color:#ffffff;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#f59e0b;">LMS Access Ready</p>
                <h1 style="margin:0;font-size:26px;line-height:1.25;">Welcome to your Adyapan learning platform</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi <strong>${escapeHtml(p.name)}</strong>,</p>
                <p style="margin:0 0 22px;font-size:14px;line-height:1.7;color:#4b5563;">Your LMS access has been created. Use the details below to join your classes, view schedules, and follow your mentorship plan.</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;margin-bottom:22px;">
                  <tr><td style="padding:18px 20px;">
                    ${[
                      ['Platform', providerLabel],
                      ['Portal Link', p.lmsPortalLink],
                      ['LMS Email', p.lmsEmail],
                      ['LMS Password', p.lmsPassword],
                      ['Batch', p.batchName],
                      ['Mentor', p.mentorName],
                      ['Counselor', p.counselorName],
                    ].filter(([, value]) => clean(value)).map(([label, value]) => `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:9px;">
                      <tr>
                        <td style="font-size:13px;color:#92400e;width:36%;font-weight:700;">${escapeHtml(label)}</td>
                        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;word-break:break-word;">${escapeHtml(value)}</td>
                      </tr>
                    </table>`).join('')}
                  </td></tr>
                </table>
                <table cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                  <tr>
                    <td style="border-radius:12px;background:linear-gradient(135deg,#ffa800,#ff6b00);">
                      <a href="${escapeHtml(p.lmsPortalLink)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;border-radius:12px;">Open LMS Portal</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#6b7280;">You can also view this securely inside your Adyapan dashboard: <a href="${dashboardUrl}" style="color:#ea580c;font-weight:700;">${dashboardUrl}</a></p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Need help? Contact ${escapeHtml(support)}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${p.name},

Your LMS access is ready.

Platform: ${providerLabel}
Portal: ${p.lmsPortalLink}
Email: ${p.lmsEmail}
Password: ${p.lmsPassword}
${p.batchName ? `Batch: ${p.batchName}\n` : ''}${p.mentorName ? `Mentor: ${p.mentorName}\n` : ''}${p.counselorName ? `Counselor: ${p.counselorName}\n` : ''}
Dashboard: ${dashboardUrl}
Support: ${support}`;

  try {
    const resend = new Resend(config.apiKey);
    const result = await resend.emails.send({
      from: config.from,
      to: p.email,
      subject: 'Your Adyapan LMS Access is Ready',
      html,
      text,
    });
    if (result.error) {
      console.error('[LMS Email] Resend error:', result.error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[LMS Email] Failed:', err?.message);
    return false;
  }
}

export async function sendLMSAccessWhatsApp(p: LMSAccessNotificationPayload): Promise<boolean> {
  const endpoint = clean(process.env.WHATSAPP_API_URL);
  const token = clean(process.env.WHATSAPP_API_TOKEN);
  const to = clean(p.phone).replace(/^\+91/, '').replace(/\D/g, '').slice(-10);

  if (!endpoint || !token || to.length !== 10) return false;

  const message =
    `Hi ${p.name.split(' ')[0] || 'Student'}, your Adyapan LMS access is ready.\n` +
    `Portal: ${p.lmsPortalLink}\nEmail: ${p.lmsEmail}\nPassword: ${p.lmsPassword}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: `91${to}`, message }),
    });
    if (!res.ok) {
      console.error('[LMS WhatsApp] Provider error:', await res.text());
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[LMS WhatsApp] Failed:', err?.message);
    return false;
  }
}
