import { NextRequest, NextResponse } from 'next/server';
import { markRequestSessionTabClosing } from '@/lib/session';

export async function POST(request: NextRequest) {
  await markRequestSessionTabClosing(request);
  return NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
