import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashEmailVerificationToken } from '@/lib/email-verification';
import AuthUser from '@/models/AuthUser';

function redirectToAuth(request: NextRequest, status: 'verified' | 'invalid' | 'expired') {
  const url = new URL('/auth', request.url);
  url.searchParams.set('mode', 'login');
  url.searchParams.set('emailVerification', status);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) return redirectToAuth(request, 'invalid');

  try {
    await connectToDatabase();

    const tokenHash = hashEmailVerificationToken(token);
    const user = await AuthUser.findOne({ emailVerificationToken: tokenHash });

    if (!user) return redirectToAuth(request, 'invalid');
    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return redirectToAuth(request, 'expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = '';
    user.emailVerificationExpires = undefined;
    await user.save();

    return redirectToAuth(request, 'verified');
  } catch (error) {
    console.error('[VerifyEmail] Error:', error);
    return redirectToAuth(request, 'invalid');
  }
}
