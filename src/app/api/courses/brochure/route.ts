import { NextRequest, NextResponse } from 'next/server';
import { s3Url } from '@/lib/s3Url';
import { getBrochureFile } from '@/lib/courseData';

/**
 * GET /api/courses/brochure?title=...
 * Redirects to the S3 URL for the matching brochure PDF.
 * Falls back to fuzzy matching against the BROCHURE_MAP.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseTitle = searchParams.get('title');

  if (!courseTitle || courseTitle.trim() === '') {
    return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
  }

  const matchedFile = getBrochureFile(courseTitle.trim());

  if (!matchedFile) {
    return NextResponse.json(
      { error: `No brochure found for "${courseTitle}"` },
      { status: 404 }
    );
  }

  // Redirect to the S3 URL for the brochure
  const brochureUrl = s3Url(`/brochures/${matchedFile}`);

  return NextResponse.redirect(brochureUrl, { status: 302 });
}
