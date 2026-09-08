/**
 * GET /api/certificate-templates/:type/download
 * Downloads the certificate template image for the given type.
 *
 * Auth: JWT cookie required (students must be logged in).
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import CertificateTemplate from '@/models/CertificateTemplate';

const DOWNLOAD_NAMES: Record<string, string> = {
  best_performance:      'best-performance-certificate.png',
  course_completion:     'course-completion-certificate.png',
  internship_completion: 'internship-completion-certificate.png',
  project_completion:    'project-completion-certificate.png',
};

const TEMPLATE_IMAGES: Record<string, string> = {
  best_performance:      '/certificates/templates/best-performance.png',
  course_completion:     '/certificates/templates/course-completion.png',
  internship_completion: '/certificates/templates/internship-completion.png',
  project_completion:    '/certificates/templates/project-completion.png',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();
    const { type } = await params;

    const template = await CertificateTemplate.findOne({ type, isActive: true }).lean();
    if (!template) {
      return NextResponse.json(
        { error: `Certificate template "${type}" not found.` },
        { status: 404 }
      );
    }

    const imagePath = TEMPLATE_IMAGES[type] ?? (template as any).imageUrl;
    if (!imagePath?.startsWith('/certificates/templates/')) {
      return NextResponse.json(
        { error: 'Certificate image path is invalid.' },
        { status: 400 }
      );
    }

    const imageResponse = await fetch(new URL(imagePath, req.nextUrl.origin), {
      cache: 'force-cache',
    });
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Certificate image file not found on server.' },
        { status: 404 }
      );
    }

    const fileBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const downloadName = DOWNLOAD_NAMES[type] ?? `${type}-certificate.png`;

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type':        'image/png',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Length':      String(fileBuffer.length),
        'Cache-Control':       'no-store',
      },
    });
  } catch (err: any) {
    console.error('[Template Download]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
