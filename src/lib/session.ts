import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authCookieOptions, getClientIp, requireJwtSecret } from '@/lib/security';
import AuthSession from '@/models/AuthSession';

const HOST_COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Host-' : '';

export const AUTH_TOKEN_COOKIE = `${HOST_COOKIE_PREFIX}adyapanToken`;
export const AUTH_SESSION_COOKIE = `${HOST_COOKIE_PREFIX}adyapanSession`;
export const LEGACY_AUTH_TOKEN_COOKIE = 'authToken';
export const LEGACY_AUTH_SESSION_COOKIE = 'authSession';
export const IDLE_TIMEOUT_SECONDS = 15 * 60;
export const ACCESS_TOKEN_SECONDS = 15 * 60;
const TOKEN_REFRESH_THRESHOLD_SECONDS = 5 * 60;
const TOKEN_ROTATION_GRACE_SECONDS = 30;
const TAB_CLOSE_GRACE_SECONDS = 12;

type SessionUser = {
  _id: { toString(): string };
  email: string;
  role: string;
  name?: string;
};

export type SessionTokenPayload = {
  userId: string;
  email: string;
  role: string;
  name?: string;
  sid: string;
  fpHash: string;
  iat: number;
  exp: number;
};

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function randomSecret() {
  return crypto.randomBytes(32).toString('base64url');
}

function userAgentHash(request: NextRequest) {
  return sha256(request.headers.get('user-agent') || 'unknown');
}

function sessionIpMatches(storedIp: string, currentIp: string) {
  return !storedIp || storedIp === 'unknown' || !currentIp || currentIp === 'unknown' || storedIp === currentIp;
}

function accessTokenHashMatches(session: { accessTokenHash?: string; previousAccessTokenHash?: string; tokenRotatedAt?: Date }, tokenHash: string) {
  if (!session.accessTokenHash) return true;
  if (session.accessTokenHash === tokenHash) return true;
  if (session.previousAccessTokenHash !== tokenHash || !session.tokenRotatedAt) return false;

  const rotatedAt = new Date(session.tokenRotatedAt).getTime();
  return Date.now() - rotatedAt <= TOKEN_ROTATION_GRACE_SECONDS * 1000;
}

function unauthorizedSession(message: string) {
  const response = NextResponse.json(
    { error: message },
    { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
  clearSessionCookies(response);
  return response;
}

async function revokeSessionById(sessionId: string) {
  await AuthSession.findByIdAndUpdate(sessionId, { revokedAt: new Date() });
}

function signAccessToken(user: SessionUser, sessionId: string, fingerprintHash: string) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      sid: sessionId,
      fpHash: fingerprintHash,
    },
    requireJwtSecret(),
    { expiresIn: ACCESS_TOKEN_SECONDS }
  );
}

export async function attachLoginSession(
  response: NextResponse,
  request: NextRequest,
  user: SessionUser,
  absoluteMaxAgeSeconds: number
) {
  await connectToDatabase();

  const now = new Date();
  const fingerprint = randomSecret();
  const fingerprintHash = sha256(fingerprint);
  const idleExpiresAt = new Date(now.getTime() + IDLE_TIMEOUT_SECONDS * 1000);
  const expiresAt = new Date(now.getTime() + absoluteMaxAgeSeconds * 1000);

  const session = await AuthSession.create({
    userId: user._id.toString(),
    role: user.role,
    fingerprintHash,
    userAgentHash: userAgentHash(request),
    ipAddress: getClientIp(request),
    lastSeenAt: now,
    idleExpiresAt,
    expiresAt,
  });

  const token = signAccessToken(user, session._id.toString(), fingerprintHash);
  session.accessTokenHash = sha256(token);
  await session.save();

  clearSessionCookies(response);
  response.cookies.set(AUTH_TOKEN_COOKIE, token, authCookieOptions(ACCESS_TOKEN_SECONDS));
  response.cookies.set(AUTH_SESSION_COOKIE, fingerprint, authCookieOptions(absoluteMaxAgeSeconds));
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_COOKIE, '', { ...authCookieOptions(0), maxAge: 0 });
  response.cookies.set(AUTH_SESSION_COOKIE, '', { ...authCookieOptions(0), maxAge: 0 });
  response.cookies.set(LEGACY_AUTH_TOKEN_COOKIE, '', { ...authCookieOptions(0), maxAge: 0 });
  response.cookies.set(LEGACY_AUTH_SESSION_COOKIE, '', { ...authCookieOptions(0), maxAge: 0 });
}

export async function revokeRequestSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return;

  try {
    const decoded = jwt.verify(token, requireJwtSecret()) as SessionTokenPayload;
    if (!decoded.sid) return;
    await connectToDatabase();
    await AuthSession.findByIdAndUpdate(decoded.sid, { revokedAt: new Date() });
  } catch {
    // Logout should still clear cookies even if the token is already invalid.
  }
}

export async function markRequestSessionTabClosing(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return;

  try {
    const decoded = jwt.verify(token, requireJwtSecret()) as SessionTokenPayload;
    if (!decoded.sid) return;

    await connectToDatabase();
    const now = new Date();
    await AuthSession.findByIdAndUpdate(decoded.sid, {
      tabCloseStartedAt: now,
      tabCloseExpiresAt: new Date(now.getTime() + TAB_CLOSE_GRACE_SECONDS * 1000),
    });
  } catch {
    // Best effort only. Normal auth validation will handle invalid sessions.
  }
}

export async function hasActiveUserSessions(userId: string) {
  await connectToDatabase();
  const now = new Date();
  const session = await AuthSession.findOne({
    userId,
    $or: [{ revokedAt: { $exists: false } }, { revokedAt: null }],
    expiresAt: { $gt: now },
    idleExpiresAt: { $gt: now },
    $and: [
      {
        $or: [
          { tabCloseExpiresAt: { $exists: false } },
          { tabCloseExpiresAt: null },
          { tabCloseExpiresAt: { $gt: now } },
        ],
      },
    ],
  }).select('_id');

  return Boolean(session);
}

export async function revokeActiveUserSessions(userId: string) {
  await connectToDatabase();
  const now = new Date();
  await AuthSession.updateMany(
    {
      userId,
      $or: [{ revokedAt: { $exists: false } }, { revokedAt: null }],
      expiresAt: { $gt: now },
      idleExpiresAt: { $gt: now },
    },
    { $set: { revokedAt: now } }
  );
}

export async function validateRequestSession(
  request: NextRequest,
  options: { extendIdle?: boolean } = {}
): Promise<SessionTokenPayload | NextResponse> {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const fingerprint = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  if (!token || !fingerprint) {
    return unauthorizedSession('Unauthorized - missing session');
  }

  let decoded: SessionTokenPayload;
  try {
    decoded = jwt.verify(token, requireJwtSecret()) as SessionTokenPayload;
  } catch {
    return unauthorizedSession('Unauthorized - invalid or expired token');
  }

  if (!decoded.sid || !decoded.fpHash || decoded.fpHash !== sha256(fingerprint)) {
    if (decoded.sid) {
      await revokeSessionById(decoded.sid);
    }
    return unauthorizedSession('Unauthorized - session binding failed');
  }

  await connectToDatabase();

  const now = new Date();
  const session = await AuthSession.findById(decoded.sid);
  if (!session || session.revokedAt || session.expiresAt <= now || session.idleExpiresAt <= now) {
    return unauthorizedSession('Unauthorized - session expired');
  }

  if (session.tabCloseExpiresAt) {
    if (session.tabCloseExpiresAt <= now) {
      await revokeSessionById(decoded.sid);
      return unauthorizedSession('Unauthorized - session closed');
    }

    session.tabCloseStartedAt = undefined;
    session.tabCloseExpiresAt = undefined;
  }

  if (
    session.userId !== decoded.userId ||
    session.role !== decoded.role ||
    session.fingerprintHash !== decoded.fpHash ||
    !accessTokenHashMatches(session, sha256(token)) ||
    session.userAgentHash !== userAgentHash(request) ||
    !sessionIpMatches(session.ipAddress, getClientIp(request))
  ) {
    await revokeSessionById(decoded.sid);
    return unauthorizedSession('Unauthorized - session mismatch');
  }

  if (options.extendIdle) {
    session.lastSeenAt = now;
    session.idleExpiresAt = new Date(now.getTime() + IDLE_TIMEOUT_SECONDS * 1000);
  }

  if (options.extendIdle || session.isModified('tabCloseStartedAt') || session.isModified('tabCloseExpiresAt')) {
    await session.save();
  }

  return decoded;
}

export async function getOptionalRequestSession(request: NextRequest): Promise<SessionTokenPayload | null> {
  const auth = await validateRequestSession(request);
  return auth instanceof NextResponse ? null : auth;
}

export async function refreshRequestSession(request: NextRequest) {
  const auth = await validateRequestSession(request, { extendIdle: true });
  if (auth instanceof NextResponse) return auth;

  const fingerprint = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  if (!fingerprint) {
    return unauthorizedSession('Unauthorized - missing session');
  }

  const res = NextResponse.json({
    success: true,
    expiresIn: ACCESS_TOKEN_SECONDS,
    idleTimeout: IDLE_TIMEOUT_SECONDS,
  });

  const secondsUntilExpiry = auth.exp - Math.floor(Date.now() / 1000);
  if (secondsUntilExpiry > TOKEN_REFRESH_THRESHOLD_SECONDS) {
    res.cookies.set(AUTH_SESSION_COOKIE, fingerprint, authCookieOptions(7 * 24 * 60 * 60));
    return res;
  }

  const token = signAccessToken(
    {
      _id: { toString: () => auth.userId },
      email: auth.email,
      role: auth.role,
      name: auth.name,
    },
    auth.sid,
    auth.fpHash
  );

  const session = await AuthSession.findById(auth.sid).select('accessTokenHash');
  await AuthSession.findByIdAndUpdate(auth.sid, {
    previousAccessTokenHash: session?.accessTokenHash,
    accessTokenHash: sha256(token),
    tokenRotatedAt: new Date(),
  });
  res.cookies.set(AUTH_TOKEN_COOKIE, token, authCookieOptions(ACCESS_TOKEN_SECONDS));
  res.cookies.set(AUTH_SESSION_COOKIE, fingerprint, authCookieOptions(7 * 24 * 60 * 60));
  return res;
}
