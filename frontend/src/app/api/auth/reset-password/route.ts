import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth-crypto';
import { connectToDatabase } from '@/lib/mongodb';
import {
  getClientIp,
  isRateLimited,
  rateLimitResponse,
  sanitizeMongoInput,
} from '@/lib/security';
import AuthUser from '@/models/AuthUser';

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`reset-password:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse('Too many password reset attempts. Please try again later.');
  }

  try {
    const body = sanitizeMongoInput(await request.json());
    const validatedData = ResetPasswordSchema.parse(body);

    await connectToDatabase();

    const resetPasswordToken = hashResetToken(validatedData.token);
    const user = await AuthUser.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.password);

    // Update user password
    user.passwordHash = hashedPassword;
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
