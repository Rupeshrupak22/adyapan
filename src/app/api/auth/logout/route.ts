/**
 * POST /api/auth/logout
 * Clears the authToken httpOnly cookie on all paths.
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookies, revokeRequestSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  await revokeRequestSession(request);

  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });

  clearSessionCookies(res);

  return res;
}
