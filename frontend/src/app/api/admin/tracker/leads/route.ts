/**
 * /api/admin/tracker/leads  — admin-only CRM lead management.
 *
 * GET   : list CRM leads (filter by status / course / date, search, paginated).
 *         Genuine enquiries from the public contact form (ContactMessage) are
 *         lazily mirrored into CrmLead so the pipeline reflects REAL submitted
 *         enquiries only — leads are never fabricated from anonymous analytics.
 * PATCH : update a lead's status and/or append an internal follow-up note.
 *
 * All handlers require ADMIN or SUPERADMIN.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import { sanitizeMongoInput } from '@/lib/security';
import CrmLead, { CRM_LEAD_STATUSES } from '@/models/CrmLead';
import ContactMessage from '@/models/ContactMessage';

// Mirror genuine contact-form enquiries into the CRM pipeline (idempotent).
// Only real submitted enquiries are mirrored; nothing is invented.
async function syncContactEnquiries(): Promise<void> {
  // Pull recent enquiries and upsert a CrmLead per unique sourceRefId.
  const recent = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  if (recent.length === 0) return;

  const ops = recent.map((m: any) => ({
    updateOne: {
      filter: { sourceRefId: String(m._id) },
      update: {
        $setOnInsert: {
          source: 'contact-form',
          sourceRefId: String(m._id),
          name: m.name || 'Unknown',
          email: m.email || '',
          phone: m.phone || '',
          courseInterest: m.subject || '',
          campaign: '',
          status: 'New',
          followUps: [],
          createdAt: m.createdAt,
        },
      },
      upsert: true,
    },
  }));

  try {
    await CrmLead.bulkWrite(ops, { ordered: false });
  } catch (err: unknown) {
    // Duplicate-key races are harmless (unique sourceRefId); log others.
    const code = (err as { code?: number })?.code;
    if (code !== 11000) {
      console.error('[tracker/leads] sync warning:', err instanceof Error ? err.message : err);
    }
  }
}

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    await syncContactEnquiries();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const course = searchParams.get('course') || '';
    const search = searchParams.get('search') || '';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all' && CRM_LEAD_STATUSES.includes(status as any)) {
      filter.status = status;
    }
    if (course) filter.courseInterest = { $regex: course, $options: 'i' };
    if (from || to) {
      const createdAt: Record<string, Date> = {};
      if (from && !isNaN(Date.parse(from))) createdAt.$gte = new Date(from);
      if (to && !isNaN(Date.parse(to))) createdAt.$lte = new Date(to);
      if (Object.keys(createdAt).length) filter.createdAt = createdAt;
    }
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { courseInterest: { $regex: search, $options: 'i' } },
      ];
    }

    const [leads, total, byStatus] = await Promise.all([
      CrmLead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CrmLead.countDocuments(filter),
      CrmLead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const row of byStatus as Array<{ _id: string; count: number }>) {
      if (row._id) statusCounts[row._id] = row.count;
    }

    return NextResponse.json({
      success: true,
      leads,
      total,
      page,
      pages: Math.ceil(total / limit),
      statusCounts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[admin/tracker/leads GET]', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const PatchSchema = z.object({
  id: z.string().min(1, 'id is required'),
  status: z.enum(CRM_LEAD_STATUSES).optional(),
  note: z.string().trim().min(1).max(2000).optional(),
});

export async function PATCH(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = sanitizeMongoInput(await request.json());
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { id, status, note } = parsed.data;
    if (!status && !note) {
      return NextResponse.json({ error: 'Provide a status and/or a note.' }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (status) update.$set = { status };
    if (note) {
      // Attribute the note to the authenticated admin (email from the token).
      update.$push = {
        followUps: { note, by: auth.email || auth.name || 'admin', at: new Date() },
      };
    }

    const updated = await CrmLead.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[admin/tracker/leads PATCH]', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
