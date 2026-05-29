import { NextRequest, NextResponse } from 'next/server';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow',
};

export function blockDirectBrowserNavigation(request: NextRequest) {
  const fetchMode = request.headers.get('sec-fetch-mode');
  const fetchDest = request.headers.get('sec-fetch-dest');
  const accept = request.headers.get('accept') || '';

  if (
    fetchMode === 'navigate' ||
    fetchDest === 'document' ||
    accept.includes('text/html')
  ) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  return null;
}
