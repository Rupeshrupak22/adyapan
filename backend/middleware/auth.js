/**
 * Auth Middleware — JWT verification + RBAC
 * Supports httpOnly cookies.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AuthSession = require('../models/AuthSession');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

const COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Host-' : '';
const AUTH_TOKEN_COOKIE = `${COOKIE_PREFIX}adyapanToken`;
const AUTH_SESSION_COOKIE = `${COOKIE_PREFIX}adyapanSession`;
const LEGACY_AUTH_TOKEN_COOKIE = 'authToken';
const LEGACY_AUTH_SESSION_COOKIE = 'authSession';
const TOKEN_ROTATION_GRACE_MS = 30 * 1000;

/**
 * Verify JWT from the auth cookie.
 * Attaches decoded payload to req.user.
 */
function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function getIp(req) {
  return req.headers['cf-connecting-ip']
    || req.headers['x-real-ip']
    || String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.ip
    || 'unknown';
}

function ipMatches(storedIp, currentIp) {
  return !storedIp || storedIp === 'unknown' || !currentIp || currentIp === 'unknown' || storedIp === currentIp;
}

function accessTokenHashMatches(session, tokenHash) {
  if (!session.accessTokenHash) return true;
  if (session.accessTokenHash === tokenHash) return true;
  if (session.previousAccessTokenHash !== tokenHash || !session.tokenRotatedAt) return false;
  return Date.now() - new Date(session.tokenRotatedAt).getTime() <= TOKEN_ROTATION_GRACE_MS;
}

function clearAuthCookies(res) {
  res.clearCookie(AUTH_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(AUTH_SESSION_COOKIE, { path: '/' });
  res.clearCookie(LEGACY_AUTH_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(LEGACY_AUTH_SESSION_COOKIE, { path: '/' });
}

async function rejectSession(res, message, sessionId) {
  if (sessionId) {
    await AuthSession.findByIdAndUpdate(sessionId, { revokedAt: new Date() });
  }
  clearAuthCookies(res);
  return res.status(401).json({ error: message });
}

async function authenticate(req, res, next) {
  const token = req.cookies?.[AUTH_TOKEN_COOKIE] || null;
  const fingerprint = req.cookies?.[AUTH_SESSION_COOKIE] || null;

  if (!token || !fingerprint) {
    return rejectSession(res, 'Unauthorized - missing session');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const fpHash = sha256(fingerprint);
    if (!decoded.sid || decoded.fpHash !== fpHash) {
      return rejectSession(res, 'Unauthorized - session binding failed', decoded.sid);
    }

    const session = await AuthSession.findById(decoded.sid);
    const now = new Date();
    if (!session || session.revokedAt || session.expiresAt <= now || session.idleExpiresAt <= now) {
      return rejectSession(res, 'Unauthorized - session expired', decoded.sid);
    }
    if (
      session.userId !== decoded.userId ||
      session.role !== decoded.role ||
      session.fingerprintHash !== fpHash ||
      !accessTokenHashMatches(session, sha256(token)) ||
      session.userAgentHash !== sha256(req.get('user-agent') || 'unknown') ||
      !ipMatches(session.ipAddress, getIp(req))
    ) {
      return rejectSession(res, 'Unauthorized - session mismatch', decoded.sid);
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Token expired — please log in again' });
    }
    clearAuthCookies(res);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Role-based access control.
 * Usage: authorize('ADMIN', 'SUPERADMIN')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // SUPERADMIN bypasses all role checks
    if (req.user.role === 'SUPERADMIN') return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden — insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
