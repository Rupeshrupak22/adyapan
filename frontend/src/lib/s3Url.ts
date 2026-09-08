/**
 * S3 Media URL Utility
 *
 * Always returns the full S3 URL for media assets.
 * Browser requests go directly to S3, bypassing Vercel,
 * eliminating Fast Data Transfer charges for media.
 *
 * Usage:
 *   s3Url('/images/team.jpg')
 *   → 'https://adyapan-website-storage.s3.ap-south-1.amazonaws.com/images/team.jpg'
 */

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || 'adyapan-website-storage';
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'ap-south-1';
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

/**
 * Convert a local media path to the full S3 URL.
 * Absolute URLs (http/https) pass through unchanged.
 *
 * @param path - Local path like '/images/team.jpg'
 * @returns Full S3 URL
 */
export function s3Url(path: string): string {
  if (!path) return '';

  // Already an absolute URL — return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Convert to S3 URL
  const key = path.startsWith('/') ? path.slice(1) : path;
  return `${S3_BASE_URL}/${key}`;
}

/**
 * Get the S3 base URL.
 */
export function getS3BaseUrl(): string {
  return S3_BASE_URL;
}

export default s3Url;
