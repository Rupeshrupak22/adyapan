/**
 * Auth Routes — /api/auth
 * login, signup, logout, refresh, me
 */

const express  = require('express');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/User');
const AuthSession = require('../models/AuthSession');
const { validate, signupSchema, loginSchema } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { applyProgressiveDelay } = require('../utils/progressiveDelay');

const router     = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}
const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   15 * 60 * 1000,
  path:     '/',
};

const ABSOLUTE_SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const IDLE_SESSION_MS = 15 * 60 * 1000;
const COOKIE_PREFIX = process.env.NODE_ENV === 'production' ? '__Host-' : '';
const AUTH_TOKEN_COOKIE = `${COOKIE_PREFIX}adyapanToken`;
const AUTH_SESSION_COOKIE = `${COOKIE_PREFIX}adyapanSession`;
const LEGACY_AUTH_TOKEN_COOKIE = 'authToken';
const LEGACY_AUTH_SESSION_COOKIE = 'authSession';

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

async function issueSession(req, res, user) {
  const now = new Date();
  const fingerprint = crypto.randomBytes(32).toString('base64url');
  const fingerprintHash = sha256(fingerprint);
  const session = await AuthSession.create({
    userId: user._id.toString(),
    role: user.role,
    fingerprintHash,
    userAgentHash: sha256(req.get('user-agent') || 'unknown'),
    ipAddress: getIp(req),
    lastSeenAt: now,
    idleExpiresAt: new Date(now.getTime() + IDLE_SESSION_MS),
    expiresAt: new Date(now.getTime() + ABSOLUTE_SESSION_MS),
  });
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      sid: session._id.toString(),
      fpHash: fingerprintHash,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  session.accessTokenHash = sha256(token);
  await session.save();
  clearAuthCookies(res);
  res.cookie(AUTH_TOKEN_COOKIE, token, COOKIE_OPTS);
  res.cookie(AUTH_SESSION_COOKIE, fingerprint, { ...COOKIE_OPTS, maxAge: ABSOLUTE_SESSION_MS });
}

function clearAuthCookies(res) {
  res.clearCookie(AUTH_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(AUTH_SESSION_COOKIE, { path: '/' });
  res.clearCookie(LEGACY_AUTH_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(LEGACY_AUTH_SESSION_COOKIE, { path: '/' });
}

// POST /api/auth/signup
router.post('/signup', validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone, role });
    await issueSession(req, res, user);
    res.status(201).json({
      success: true,
      user: user.toPublicProfile(),
    });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account deactivated. Contact support.' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();
      await applyProgressiveDelay(user.failedLoginAttempts);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();
    await user.save();

    await issueSession(req, res, user);

    res.json({
      success: true,
      user: user.toPublicProfile(),
    });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies?.[AUTH_TOKEN_COOKIE];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.sid) await AuthSession.findByIdAndUpdate(decoded.sid, { revokedAt: new Date() });
    } catch {}
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: user.toPublicProfile() });
  } catch (err) { next(err); }
});

module.exports = router;
