import { Resend } from 'resend';

type EmailField = {
  label: string;
  value?: unknown;
};

export type LeadNotificationPayload = {
  sourcePage: string;
  name: string;
  phone?: string;
  email?: string;
  college?: string;
  city?: string;
  course?: string;
  certification?: string;
  service?: string;
  message?: string;
  notes?: string;
  submittedAt?: Date | string;
};

function devLog(message: string, error?: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error);
  }
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

function formatDate(value?: Date | string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toLocaleString('en-IN');
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function getConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);
  const adminEmail = clean(process.env.ADMIN_EMAIL);
  const fromEmail = clean(process.env.RESEND_FROM_EMAIL) || 'onboarding@resend.dev';
  const fromName = clean(process.env.RESEND_FROM_NAME) || 'Adyapan';

  if (!apiKey || apiKey === 'ADD_NEW_RESEND_API_KEY_HERE') {
    devLog('[Resend] RESEND_API_KEY is not configured. Skipping email notification.');
    return null;
  }

  if (!adminEmail) {
    devLog('[Resend] ADMIN_EMAIL is not configured. Skipping email notification.');
    return null;
  }

  return {
    apiKey,
    adminEmail,
    from: `${fromName} <${fromEmail}>`,
  };
}

function renderRows(fields: EmailField[]) {
  return fields
    .filter((field) => clean(field.value))
    .map(
      (field) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;font-weight:700;width:160px;">${escapeHtml(field.label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#111827;font-size:14px;line-height:1.5;">${escapeHtml(field.value)}</td>
        </tr>`
    )
    .join('');
}

function fieldsFromPayload(payload: LeadNotificationPayload): EmailField[] {
  return [
    { label: 'Name', value: payload.name },
    { label: 'Phone', value: payload.phone },
    { label: 'Email', value: payload.email },
    { label: 'College', value: payload.college },
    { label: 'City', value: payload.city },
    { label: 'Course', value: payload.course },
    { label: 'Certification', value: payload.certification },
    { label: 'Service', value: payload.service },
    { label: 'Message', value: payload.message },
    { label: 'Notes', value: payload.notes },
    { label: 'Source Page', value: payload.sourcePage },
    { label: 'Submitted At', value: formatDate(payload.submittedAt) },
  ];
}

function textFromFields(fields: EmailField[]) {
  return fields
    .filter((field) => clean(field.value))
    .map((field) => `${field.label}: ${clean(field.value)}`)
    .join('\n');
}

function adminHtml(payload: LeadNotificationPayload) {
  const rows = renderRows(fieldsFromPayload(payload));
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 14px;background:#f8fafc;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;background:#ff8a00;color:#ffffff;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Adyapan Notification</p>
                <h1 style="margin:0;font-size:22px;line-height:1.3;">New form submission</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function studentHtml(name: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 14px;background:#f8fafc;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:26px 28px;">
                <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#111827;">Thank you for contacting Adyapan</h1>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374151;">Hi ${escapeHtml(name)},</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#374151;">Thank you for your interest in Adyapan. Our team has received your request and will contact you soon.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#111827;color:#f9fafb;font-size:12px;">Adyapan</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendLeadNotificationEmails(payload: LeadNotificationPayload): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const resend = new Resend(config.apiKey);
  const fields = fieldsFromPayload(payload);
  const adminSubject = `New Adyapan request - ${payload.sourcePage}`;
  const studentEmail = clean(payload.email);
  const studentName = clean(payload.name) || 'there';

  try {
    const tasks = [
      resend.emails.send({
        from: config.from,
        to: config.adminEmail,
        subject: adminSubject,
        html: adminHtml(payload),
        text: `New form submission\n\n${textFromFields(fields)}`,
      }),
    ];

    if (studentEmail) {
      tasks.push(
        resend.emails.send({
          from: config.from,
          to: studentEmail,
          subject: 'Thank you for contacting Adyapan',
          html: studentHtml(studentName),
          text: `Hi ${studentName},\nThank you for your interest in Adyapan. Our team has received your request and will contact you soon.`,
        })
      );
    }

    const results = await Promise.allSettled(tasks);
    results.forEach((result) => {
      if (result.status === 'rejected') {
        devLog('[Resend] Email send failed:', result.reason);
      } else if (result.value.error) {
        devLog('[Resend] Email send returned error:', result.value.error);
      }
    });
  } catch (error) {
    devLog('[Resend] Email notification error:', error);
  }
}
