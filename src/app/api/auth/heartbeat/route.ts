import { NextRequest } from 'next/server';
import { refreshRequestSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  return refreshRequestSession(request);
}
