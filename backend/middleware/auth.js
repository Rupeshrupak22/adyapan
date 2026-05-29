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

async function authenticate(req, res, next) {
  const token = req.cookies?.authToken || null;
  const fingerprint = req.cookies?.authSession || null;

  if (!token || !fingerprint) {
    return res.status(401).json({ error: 'Unauthorized - missing session' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const fpHash = sha256(fingerprint);
    if (!decoded.sid || decoded.fpHash !== fpHash) {
      return res.status(401).json({ error: 'Unauthorized - session binding failed' });
    }

    const session = await AuthSession.findById(decoded.sid);
    const now = new Date();
    if (!session || session.revokedAt || session.expiresAt <= now || session.idleExpiresAt <= now) {
      return res.status(401).json({ error: 'Unauthorized - session expired' });
    }
    if (
      session.userId !== decoded.userId ||
      session.role !== decoded.role ||
      session.fingerprintHash !== fpHash ||
      session.userAgentHash !== sha256(req.get('user-agent') || 'unknown') ||
      !ipMatches(session.ipAddress, getIp(req))
    ) {
      return res.status(401).json({ error: 'Unauthorized - session mismatch' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please log in again' });
    }
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
