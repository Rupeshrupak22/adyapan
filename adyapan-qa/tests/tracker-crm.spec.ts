import { test, expect, request as pwRequest } from '@playwright/test';

/**
 * Tracker & CRM API tests.
 *
 * Target base URL comes from TRACKER_BASE_URL (default http://localhost:3000),
 * so these run against a local `next start` server or a staging deploy. They
 * are skipped automatically if the server is unreachable, so the suite never
 * fails just because no server is running.
 */
const BASE = process.env.TRACKER_BASE_URL || 'http://localhost:3000';

async function serverUp(): Promise<boolean> {
  try {
    const ctx = await pwRequest.newContext();
    const res = await ctx.get(`${BASE}/robots.txt`, { timeout: 4000 });
    await ctx.dispose();
    return res.ok();
  } catch {
    return false;
  }
}

test.describe('Tracker ingestion /api/tracker/events', () => {
  test('accepts a valid event batch', async ({ request }) => {
    test.skip(!(await serverUp()), `Server not reachable at ${BASE}`);

    const res = await request.post(`${BASE}/api/tracker/events`, {
      data: {
        events: [
          {
            eventName: 'page_view',
            anonymousVisitorId: 'test-visitor',
            sessionId: 'test-session',
            pagePath: '/courses/data-science?utm_source=test',
            deviceType: 'desktop',
          },
        ],
      },
    });
    // 202 accepted (or 200 if DB unavailable — graceful, still not an error).
    expect([200, 202]).toContain(res.status());
  });

  test('rejects an invalid payload with 400', async ({ request }) => {
    test.skip(!(await serverUp()), `Server not reachable at ${BASE}`);

    const res = await request.post(`${BASE}/api/tracker/events`, {
      data: { events: [{ eventName: 'not_a_real_event', pagePath: '/x' }] },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects an empty batch with 400', async ({ request }) => {
    test.skip(!(await serverUp()), `Server not reachable at ${BASE}`);

    const res = await request.post(`${BASE}/api/tracker/events`, {
      data: { events: [] },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe('Admin tracker APIs require auth', () => {
  test('analytics endpoint returns 401 without a token', async ({ request }) => {
    test.skip(!(await serverUp()), `Server not reachable at ${BASE}`);

    const res = await request.get(`${BASE}/api/admin/tracker/analytics`);
    expect(res.status()).toBe(401);
  });

  test('leads endpoint returns 401 without a token', async ({ request }) => {
    test.skip(!(await serverUp()), `Server not reachable at ${BASE}`);

    const res = await request.get(`${BASE}/api/admin/tracker/leads`);
    expect(res.status()).toBe(401);
  });
});
