/**
 * GET  /api/admin/contact-messages  - list all contact messages (paginated, filterable)
 * PATCH /api/admin/contact-messages - update status (new → read → replied)
 *
 * Protected: ADMIN and SUPERADMIN only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import ContactMessage from '@/models/ContactMessage';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page   = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip   = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search.trim()) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, messages, total, page, limit });
  } catch (err: any) {
    console.error('[ContactMessages GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const { id, status } = await request.json();
    if (!id || !['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (err: any) {
    console.error('[ContactMessages PATCH]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
