/**
 * POST /api/jobs/[id]/apply - student applies for a job
 * Requires: STUDENT role (or any authenticated user)
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import JobPost from '@/models/JobPost';
import JobApplication from '@/models/JobApplication';
import {
  isValidName, nameFormatMessage, normalizeName,
  isStrictEmail, strictEmailMessage, normalizeEmail,
  isIndianMobile, indianMobileMessage, normalizeIndianMobile,
} from '@/lib/security';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = protectRoute(req);
  const isAuth = !(auth instanceof NextResponse);

  if (isAuth && auth.role === 'COMPANY') {
    return NextResponse.json({ error: 'Companies cannot apply for jobs' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const job = await JobPost.findOne({ _id: id, status: 'active' });
    if (!job) return NextResponse.json({ error: 'Job not found or no longer active' }, { status: 404 });

    const body = await req.json();
    const { studentName, studentEmail, studentPhone, cvUrl, portfolioUrl, message } = body;

    if (!isValidName(studentName)) {
      return NextResponse.json({ error: nameFormatMessage() }, { status: 400 });
    }
    if (!isStrictEmail(studentEmail)) {
      return NextResponse.json({ error: strictEmailMessage() }, { status: 400 });
    }
    const phone = normalizeIndianMobile(studentPhone || '');
    if (phone && !isIndianMobile(phone)) {
      return NextResponse.json({ error: indianMobileMessage() }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(studentEmail);
    const applicantStudentId = isAuth ? auth.userId : `guest_${normalizedEmail.replace(/[^a-z0-9]/g, '_')}`;

    // Check duplicate application by either studentId or studentEmail for this job
    const existing = await JobApplication.findOne({
      jobId: id,
      $or: [
        { studentId: applicantStudentId },
        { studentEmail: normalizedEmail },
      ]
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 });
    }

    const application = await JobApplication.create({
      jobId: id,
      companyId: job.companyId,
      studentId: applicantStudentId,
      studentName: normalizeName(studentName),
      studentEmail: normalizedEmail,
      studentPhone: phone,
      cvUrl: cvUrl || '',
      portfolioUrl: portfolioUrl || '',
      message: message || '',
      status: 'applied',
      appliedAt: new Date(),
    });

    await JobPost.findByIdAndUpdate(id, { $inc: { applicantsCount: 1 } });
    return NextResponse.json({ success: true, application, message: 'Application submitted successfully' }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 });
    console.error('[JobApply POST]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
