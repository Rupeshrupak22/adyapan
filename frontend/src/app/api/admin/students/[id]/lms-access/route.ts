import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import StudentLMSAccess from '@/models/StudentLMSAccess';
import { sendLMSAccessEmail, sendLMSAccessWhatsApp } from '@/lib/lms-notifications';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function clean(value: unknown) {
  return String(value ?? '').trim();
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await context.params;

    const access = await StudentLMSAccess.findOne({ userId: id }).lean();
    return NextResponse.json({ success: true, access: access || null });
  } catch (err: any) {
    console.error('[Admin LMS Access GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = protectRouteByRole(request, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { id } = await context.params;
    const body = await request.json();

    const lmsEmail = clean(body.lmsEmail);
    const lmsPassword = clean(body.lmsPassword);
    const lmsPortalLink = clean(body.lmsPortalLink);

    if (!lmsEmail || !lmsPassword || !lmsPortalLink) {
      return NextResponse.json(
        { error: 'LMS email, password, and portal link are required.' },
        { status: 400 }
      );
    }

    const student = await AuthUser.findOne({ _id: id, role: 'STUDENT' }).lean();
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const payload = {
      userId:                id,
      studentEmail:          clean((student as any).email).toLowerCase(),
      studentName:           clean((student as any).name) || 'Student',
      lmsProvider:           clean(body.lmsProvider) || 'custom',
      lmsEmail,
      lmsPassword,
      lmsPortalLink,
      batchName:             clean(body.batchName),
      mentorName:            clean(body.mentorName),
      counselorName:         clean(body.counselorName),
      supportContact:        clean(body.supportContact) || 'support@adyapan.com',
      whatsappNumber:        clean(body.whatsappNumber) || clean((student as any).phone),
      certificationGuidance: clean(body.certificationGuidance),
      assignedBy:            auth.userId,
      assignedAt:            new Date(),
    };

    const saved = await StudentLMSAccess.findOneAndUpdate(
      { userId: id },
      { $set: payload },
      { upsert: true, new: true, runValidators: true }
    );

    const notificationPayload = {
      name:           payload.studentName,
      email:          payload.studentEmail,
      phone:          payload.whatsappNumber,
      lmsProvider:    payload.lmsProvider,
      lmsEmail:       payload.lmsEmail,
      lmsPassword:    payload.lmsPassword,
      lmsPortalLink:  payload.lmsPortalLink,
      batchName:      payload.batchName,
      mentorName:     payload.mentorName,
      counselorName:  payload.counselorName,
      supportContact: payload.supportContact,
    };

    const [emailSent, whatsappSent] = await Promise.all([
      sendLMSAccessEmail(notificationPayload),
      sendLMSAccessWhatsApp(notificationPayload),
    ]);

    saved.emailSent = emailSent;
    saved.whatsappSent = whatsappSent;
    await saved.save();

    return NextResponse.json({ success: true, access: saved });
  } catch (err: any) {
    console.error('[Admin LMS Access PUT]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
