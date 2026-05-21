import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { authCookieOptions } from '@/lib/security';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const STATE_COOKIE = 'googleOAuthState';

function getAppUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    request.nextUrl.origin
  ).replace(/\/$/, '');
}

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/')) return '';
  if (value.startsWith('//')) return '';
  return value.slice(0, 300);
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url));
  }

  const roleParam = request.nextUrl.searchParams.get('role');
  const role = roleParam === 'organization' ? 'organization' : 'student';
  const mode = request.nextUrl.searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const redirect = safeRedirect(request.nextUrl.searchParams.get('redirect'));
  const nonce = randomBytes(24).toString('base64url');
  const state = Buffer.from(JSON.stringify({ nonce, role, mode, redirect })).toString('base64url');
  const appUrl = getAppUrl(request);

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${appUrl}/api/auth/google/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(STATE_COOKIE, nonce, authCookieOptions(10 * 60));
  return response;
}
