/**
 * S3 Media URL Utility
 *
 * Returns the path for media assets. When NEXT_PUBLIC_S3_ENABLED is 'true'
 * and the S3 bucket has public read access, this returns the full S3 URL.
 * Otherwise, it returns the local path as-is (served from public/ or via
 * Next.js fallback rewrites).
 *
 * This allows a zero-downtime migration:
 *   1. Keep public/ files → s3Url returns local paths → files load from public/
 *   2. Enable S3 public access + set NEXT_PUBLIC_S3_ENABLED=true → loads from S3
 *   3. Delete public/ folders → fallback rewrites serve from S3
 */

const S3_ENABLED = process.env.NEXT_PUBLIC_S3_ENABLED === 'true';
const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || 'adyapan-website-storage';
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'ap-south-1';
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

/**
 * Resolve a media path.
 * - If S3 is enabled, converts local paths to full S3 URLs.
 * - If S3 is not enabled, returns the path unchanged (served locally).
 * - Absolute URLs (http/https) always pass through unchanged.
 *
 * @param path - Local path like '/images/team.jpg'
 * @returns Resolved URL (local or S3)
 */
export function s3Url(path: string): string {
  if (!path) return '';

  // Already an absolute URL — return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If S3 is not enabled, return the local path as-is
  if (!S3_ENABLED) {
    return path;
  }

  // Convert to S3 URL
  const key = path.startsWith('/') ? path.slice(1) : path;
  return `${S3_BASE_URL}/${key}`;
}

/**
 * Get the S3 base URL for constructing URLs manually.
 */
export function getS3BaseUrl(): string {
  return S3_BASE_URL;
}

export default s3Url;
