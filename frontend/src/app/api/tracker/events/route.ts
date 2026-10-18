/**
 * POST /api/tracker/events  — first-party analytics ingestion (public, no auth)
 *
 * Accepts a small, strictly allow-listed batch of privacy-conscious website
 * events from the first-party WebsiteTracker client. Design rules:
 *  - Strict zod schema + field allow-listing + length/size caps.
 *  - Rate limited per client IP to resist abuse.
 *  - Graceful: a storage failure returns 200 with { stored: 0 } so the public
 *    site is never broken by analytics. Malformed payloads return 400.
 *  - NEVER accepts PII, payment, auth, or enrollment-proof data. Enrollment
 *    metrics are derived from trusted server-side records elsewhere.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import {
  getClientIp,
  isRateLimited,
  rateLimitResponse,
  sanitizeMongoInput,
} from '@/lib/security';
import AnalyticsEvent, { ANALYTICS_EVENT_NAMES, DEVICE_TYPES } from '@/models/AnalyticsEvent';

// Keep the payload tiny and strict. Unknown keys are stripped by zod.
const CampaignSchema = z
  .object({
    source:   z.string().max(120).optional(),
    medium:   z.string().max(120).optional(),
    campaign: z.string().max(160).optional(),
    term:     z.string().max(160).optional(),
    content:  z.string().max(160).optional(),
  })
  .strip();

const EventSchema = z
  .object({
    eventName: z.enum(ANALYTICS_EVENT_NAMES),
    anonymousVisitorId: z.string().min(1).max(64),
    sessionId: z.string().min(1).max(64),
    pagePath: z.string().min(1).max(512),
    referrerDomain: z.string().max(253).optional().default(''),
    campaign: CampaignSchema.optional().default({}),
    courseId: z.string().max(160).optional().default(''),
    label: z.string().max(120).optional().default(''),
    deviceType: z.enum(DEVICE_TYPES).optional().default('unknown'),
    // Client timestamp is accepted but clamped server-side (see below).
    ts: z.number().int().positive().optional(),
  })
  .strip();

const BatchSchema = z.object({
  events: z.array(EventSchema).min(1).max(20),
});

// Only keep a path (strip query string / fragments to avoid storing PII that
// might appear in URLs) and ensure it begins with "/".
function safePagePath(path: string): string {
  const noQuery = path.split('?')[0].split('#')[0];
  const trimmed = noQuery.slice(0, 512);
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  // Generous but bounded: a normal session fires well under this.
  if (isRateLimited(`tracker:${ip}`, 120, 60 * 1000)) {
    return rateLimitResponse('Too many events. Please slow down.');
  }

  // Reject oversized bodies early (defensive; also capped by array length).
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 16 * 1024) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = sanitizeMongoInput(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = BatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
  }

  const now = Date.now();
  const docs = parsed.data.events.map((e) => {
    // Clamp timestamp to a sane window around "now" (no future, max 24h past).
    let ts = typeof e.ts === 'number' ? e.ts : now;
    if (ts > now + 60_000) ts = now;
    if (ts < now - 24 * 60 * 60 * 1000) ts = now;

    return {
      eventName: e.eventName,
      anonymousVisitorId: e.anonymousVisitorId,
      sessionId: e.sessionId,
      pagePath: safePagePath(e.pagePath),
      referrerDomain: e.referrerDomain || '',
      campaign: e.campaign || {},
      courseId: e.courseId || '',
      label: e.label || '',
      deviceType: e.deviceType || 'unknown',
      timestamp: new Date(ts),
    };
  });

  // Graceful storage: never break the public site if the DB is unavailable.
  try {
    await connectToDatabase();
    await AnalyticsEvent.insertMany(docs, { ordered: false });
    return NextResponse.json({ stored: docs.length }, { status: 202 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[tracker/events] store failed:', message);
    // 200 so the client's fire-and-forget beacon never surfaces an error.
    return NextResponse.json({ stored: 0 }, { status: 200 });
  }
}
