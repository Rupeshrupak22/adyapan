import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import ContactMessage from '@/models/ContactMessage';
import CertificationEnrollment from '@/models/CertificationEnrollment';
import OfflineInternshipLead from '@/models/OfflineInternshipLead';
import ManualLead from '@/models/ManualLead';
import ProjectRequest from '@/models/ProjectRequest';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string;
  createdAt: string;
  isNew: boolean;
};

const toDate = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const nameOrEmail = (doc: any) => doc.name || doc.userName || doc.contactName || doc.email || doc.userEmail || doc.contactEmail || 'New user';

export async function GET(request: NextRequest) {
  const auth = await protectRouteByRole(request, ['ADMIN', 'SUPERADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const portal = searchParams.get('portal') === 'organization' ? 'organization' : 'admin';
  const since = toDate(searchParams.get('since'));
  const isAdmin = auth.role === 'ADMIN' || auth.role === 'SUPERADMIN';

  const makeItem = (
    doc: any,
    type: string,
    title: string,
    message: string,
    href: string,
  ): NotificationItem => {
    const createdAt = new Date(doc.createdAt || doc.paidAt || doc.enrolledAt || Date.now());
    return {
      id: String(doc._id),
      type,
      title,
      message,
      href,
      createdAt: createdAt.toISOString(),
      isNew: since ? createdAt > since : false,
    };
  };

  try {
    const queries: Promise<NotificationItem[]>[] = [];

    if (isAdmin && portal === 'admin') {
      queries.push(
        ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean()
          .then(rows => rows.map((d: any) => makeItem(
            d,
            'contact',
            'New contact message',
            `${d.name} sent: ${d.subject}`,
            '/admin/contact-messages',
          ))),
        CertificationEnrollment.find().sort({ createdAt: -1 }).limit(5).lean()
          .then(rows => rows.map((d: any) => makeItem(
            d,
            'certification',
            'New certification lead',
            `${d.name} selected ${d.certificationName}`,
            '/admin/certification-enrollments',
          ))),
        OfflineInternshipLead.find().sort({ createdAt: -1 }).limit(5).lean()
          .then(rows => rows.map((d: any) => makeItem(
            d,
            'offline',
            'New offline enquiry',
            `${d.name} is interested in ${d.courseInterest || 'offline training'}`,
            '/admin/offline-leads',
          ))),
        ManualLead.find().sort({ createdAt: -1 }).limit(5).lean()
          .then(rows => rows.map((d: any) => makeItem(
            d,
            'manual',
            'Manual lead added',
            `${d.name} was added by ${d.addedByAdmin || 'admin'}`,
            '/admin/manual-leads',
          ))),
      );
    }

    queries.push(
      Payment.find({ ...(portal === 'organization' ? { status: 'success' } : {}) })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .then(rows => rows.map((d: any) => makeItem(
          d,
          'payment',
          d.status === 'success' ? 'New payment received' : 'Payment update',
          `${nameOrEmail(d)} paid Rs. ${Number(d.totalAmount || 0).toLocaleString('en-IN')}`,
          `${portal === 'organization' ? '/organization' : '/admin'}/payments`,
        ))),
      Enrollment.find().sort({ createdAt: -1 }).limit(5).lean()
        .then(rows => rows.map((d: any) => makeItem(
          d,
          'enrollment',
          'New course enrollment',
          `${d.courseName || 'Course'} enrolled via ${d.planLabel || 'plan'}`,
          `${portal === 'organization' ? '/organization' : '/admin'}/online-enrollments`,
        ))),
      ProjectRequest.find().sort({ createdAt: -1 }).limit(5).lean()
        .then(rows => rows.map((d: any) => makeItem(
          d,
          'project',
          'New project request',
          `${d.contactName} submitted ${d.projectTitle}`,
          portal === 'organization' ? '/organization' : '/admin/project-requests',
        ))),
    );

    const settled = await Promise.allSettled(queries);
    const items = settled
      .filter((r): r is PromiseFulfilledResult<NotificationItem[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);

    const fallbackUnread = isAdmin && portal === 'admin'
      ? await Promise.all([
          ContactMessage.countDocuments({ status: 'new' }),
          CertificationEnrollment.countDocuments({ status: 'new' }),
          OfflineInternshipLead.countDocuments({ status: 'new' }),
        ]).then(counts => counts.reduce((sum, count) => sum + count, 0))
      : 0;

    const unreadCount = since ? items.filter(item => item.isNew).length : fallbackUnread;
    const latestAt = items[0]?.createdAt || new Date().toISOString();

    return NextResponse.json({ success: true, items, unreadCount, latestAt });
  } catch (error) {
    console.error('[notifications] failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to load notifications' }, { status: 500 });
  }
}
