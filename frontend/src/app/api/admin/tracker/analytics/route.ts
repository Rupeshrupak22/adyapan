/**
 * GET /api/admin/tracker/analytics  — admin-only website analytics summary.
 *
 * Returns aggregated metrics for a date range computed with efficient MongoDB
 * aggregation (no per-event data is sent to the browser). Metric definitions:
 *  - pageViews        : count of page_view events in range
 *  - uniqueVisitors   : distinct anonymousVisitorId with any event in range
 *  - sessions         : distinct sessionId with any event in range
 *  - topPages         : page_view counts grouped by pagePath (top 10)
 *  - topCourses       : course_view counts grouped by courseId (top 10)
 *  - sources          : event counts grouped by referrerDomain / "direct" (top 10)
 *  - campaigns        : event counts grouped by campaign.source (top 10)
 *  - devices          : event counts grouped by deviceType
 *  - ctaClicks        : count of cta_click events
 *  - enquirySubmits   : count of enquiry_submit events (signal only, not a lead)
 *  - checkoutStarts   : count of checkout_start events
 *  - dailyTrend       : page_view counts per day in range
 *
 * Enrollment counts are intentionally NOT derived from analytics events (which
 * are untrusted); they must come from trusted Payment/Enrollment records.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import AnalyticsEvent from '@/models/AnalyticsEvent';

function parseRange(url: string): { from: Date; to: Date } {
  const { searchParams } = new URL(url);
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const fromRaw = searchParams.get('from');
  const toRaw = searchParams.get('to');

  const from = fromRaw ? new Date(fromRaw) : defaultFrom;
  const to = toRaw ? new Date(toRaw) : now;

  // Guard against invalid dates.
  const safeFrom = isNaN(from.getTime()) ? defaultFrom : from;
  const safeTo = isNaN(to.getTime()) ? now : to;
  return { from: safeFrom, to: safeTo };
}

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { from, to } = parseRange(request.url);
    const match = { timestamp: { $gte: from, $lte: to } };

    const [
      pageViews,
      ctaClicks,
      enquirySubmits,
      checkoutStarts,
      uniqueVisitorsAgg,
      sessionsAgg,
      topPages,
      topCourses,
      sources,
      campaigns,
      devices,
      dailyTrend,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ ...match, eventName: 'page_view' }),
      AnalyticsEvent.countDocuments({ ...match, eventName: 'cta_click' }),
      AnalyticsEvent.countDocuments({ ...match, eventName: 'enquiry_submit' }),
      AnalyticsEvent.countDocuments({ ...match, eventName: 'checkout_start' }),
      AnalyticsEvent.aggregate([
        { $match: match },
        { $group: { _id: '$anonymousVisitorId' } },
        { $count: 'count' },
      ]),
      AnalyticsEvent.aggregate([
        { $match: match },
        { $group: { _id: '$sessionId' } },
        { $count: 'count' },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...match, eventName: 'page_view' } },
        { $group: { _id: '$pagePath', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...match, eventName: 'course_view', courseId: { $ne: '' } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $cond: [{ $eq: ['$referrerDomain', ''] }, 'direct', '$referrerDomain'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...match, 'campaign.source': { $nin: ['', null] } } },
        { $group: { _id: '$campaign.source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: match },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { ...match, eventName: 'page_view' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const toList = (rows: Array<{ _id: string; count: number }>) =>
      rows.map((r) => ({ key: r._id, count: r.count }));

    return NextResponse.json({
      success: true,
      range: { from, to },
      metrics: {
        pageViews,
        uniqueVisitors: uniqueVisitorsAgg[0]?.count || 0,
        sessions: sessionsAgg[0]?.count || 0,
        ctaClicks,
        enquirySubmits,
        checkoutStarts,
        topPages: toList(topPages),
        topCourses: toList(topCourses),
        sources: toList(sources),
        campaigns: toList(campaigns),
        devices: toList(devices),
        dailyTrend: dailyTrend.map((d: { _id: string; count: number }) => ({ date: d._id, count: d.count })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[admin/tracker/analytics]', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
