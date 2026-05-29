import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { requireJwtSecret } from '@/lib/security';
import { AUTH_TOKEN_COOKIE, validateRequestSession } from '@/lib/session';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  name?: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, requireJwtSecret()) as DecodedToken;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  if (cookieToken) return cookieToken;
  return null;
}

export async function protectRoute(request: NextRequest): Promise<DecodedToken | NextResponse> {
  return validateRequestSession(request) as Promise<DecodedToken | NextResponse>;
}

/**
 * Protect a route by allowed roles.
 * SUPERADMIN implicitly passes ALL role checks (they can do everything).
 */
export async function protectRouteByRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<DecodedToken | NextResponse> {
  const result = await protectRoute(request);
  if (result instanceof NextResponse) return result;

  // SUPERADMIN bypasses all role restrictions
  if (result.role === 'SUPERADMIN') return result;

  if (!allowedRoles.includes(result.role)) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 });
  }
  return result;
}

/**
 * Strict superadmin-only check - does NOT allow ADMIN.
 */
export async function requireSuperAdmin(request: NextRequest): Promise<DecodedToken | NextResponse> {
  const result = await protectRoute(request);
  if (result instanceof NextResponse) return result;
  if (result.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden - superadmin access required' }, { status: 403 });
  }
  return result;
}
