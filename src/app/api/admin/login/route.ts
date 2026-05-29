/**
 * POST /api/admin/login
 *
 * Secure admin-only login with 3-factor verification:
 *  1. Email must match ADMIN_LOGIN_EMAIL env var
 *  2. Password must be correct (Argon2id with bcrypt migration)
 *  3. Access key SHA-256 must match ADMIN_ACCESS_KEY_HASH env var
 *
 * Security:
 *  - IP rate limit: 5 attempts / 15 min
 *  - Account lockout: 5 failed attempts → locked 30 min
 *  - JWT in httpOnly secure cookie
 *  - No public signup - admin accounts created via scripts only
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
import { attachLoginSession } from '@/lib/session';
import { hasConfiguredAdminAccessKeyHash, verifyAdminAccessKey } from '@/lib/adminAccessKey';
import { verifyPasswordAndUpgrade } from '@/lib/password';
import { applyProgressiveDelay } from '@/lib/progressiveDelay';
import AuthUser from '@/models/AuthUser';

const ALLOWED_ADMIN_EMAIL = (process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim();

const LoginSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(1),
  accessKey: z.string().min(1, 'Access key is required'),
});

/* ── IP rate limiter ── */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`admin-login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW)) {
    return rateLimitResponse('Too many login attempts. Please try again in 15 minutes.');
  }

  try {
    await connectToDatabase();

    if (!ALLOWED_ADMIN_EMAIL || !hasConfiguredAdminAccessKeyHash()) {
      console.error('[AdminLogin]  Missing env vars - ADMIN_EMAIL:', !!ALLOWED_ADMIN_EMAIL, 'ADMIN_ACCESS_KEY_HASH:', hasConfiguredAdminAccessKeyHash());
      return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 });
    }

    const body   = sanitizeMongoInput(await request.json());
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password, accessKey } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    /* ── 1. Access key check (first - fast fail) ── */
    if (!verifyAdminAccessKey(accessKey)) {
      console.warn(`[AdminLogin]  Invalid access key from IP: ${ip}`);
      return NextResponse.json({ error: 'Invalid access key.' }, { status: 403 });
    }

    /* ── 2. Email whitelist check ── */
    if (ALLOWED_ADMIN_EMAIL && normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      console.warn(`[AdminLogin]  Unauthorized email: ${normalizedEmail} | IP: ${ip}`);
      return NextResponse.json({ error: 'You are not authorized to access the admin panel.' }, { status: 403 });
    }

    /* ── 3. Find user ── */
    const user = await AuthUser.findOne({ email: normalizedEmail });
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      console.warn('[AdminLogin]  User not found or not admin role');
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    /* ── 4. Account lockout check ── */
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.` },
        { status: 423 }
      );
    }

    /* ── 5. Password check ── */
    const isValid = await verifyPasswordAndUpgrade(password, user.passwordHash, async (newHash) => {
      user.passwordHash = newHash;
      await user.save();
    });
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil         = new Date(Date.now() + 30 * 60 * 1000);
        user.failedLoginAttempts = 0;
        await user.save();
        await applyProgressiveDelay(5);
        return NextResponse.json({ error: 'Too many failed attempts. Account locked for 30 minutes.' }, { status: 423 });
      }
      await user.save();
      const remaining = 5 - user.failedLoginAttempts;
      await applyProgressiveDelay(user.failedLoginAttempts);
      return NextResponse.json(
        { error: `Invalid credentials. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.` },
        { status: 401 }
      );
    }

    /* ── 6. Account status ── */
    if (user.accountStatus === 'blocked') {
      return NextResponse.json({ error: 'Account suspended. Contact support.' }, { status: 403 });
    }
    if (user.accountStatus === 'pending') {
      return NextResponse.json({ error: 'Admin account is pending approval.' }, { status: 403 });
    }
    if (!user.isActive) {
      return NextResponse.json({ error: 'This admin account has been deactivated.' }, { status: 403 });
    }

    /* ── 7. Success ── */
    user.failedLoginAttempts = 0;
    user.lockedUntil         = undefined;
    user.lastLoginAt         = new Date();
    user.loginCount          = (user.loginCount || 0) + 1;
    user.lastLoginIp         = ip;
    await user.save();

    console.log(`[AdminLogin] ${user.role} login succeeded | User: ${user._id.toString()} | IP: ${ip}`);

    const res = NextResponse.json({
      success: true,
      role: user.role,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });

    await attachLoginSession(res, request, user, 8 * 60 * 60);
    return res;

  } catch (err: any) {
    console.error('[AdminLogin] Error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
