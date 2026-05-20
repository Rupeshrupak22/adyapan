import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import CertificationEnrollment from '@/models/CertificationEnrollment';

const StatusSchema = z.object({
  id: z.string().min(1, 'id is required'),
  status: z.enum(['new', 'contacted', 'enrolled', 'rejected']),
});

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { certificationName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const [enrollments, total] = await Promise.all([
      CertificationEnrollment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CertificationEnrollment.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, enrollments, total, page, limit });
  } catch (error) {
    console.error('[AdminCertificationEnrollments GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const parsed = StatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid status update' },
        { status: 400 }
      );
    }

    const updated = await CertificationEnrollment.findByIdAndUpdate(
      parsed.data.id,
      { $set: { status: parsed.data.status } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enrollment: updated });
  } catch (error) {
    console.error('[AdminCertificationEnrollments PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
