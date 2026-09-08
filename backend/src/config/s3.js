/**
 * AWS S3 Configuration
 * Centralized S3 client and utilities for media uploads/deletions.
 */

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const crypto = require('crypto');

// ── S3 Client ─────────────────────────────────────────────────
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME || 'adyapan-website-storage';
const REGION = process.env.AWS_REGION || 'ap-south-1';

/**
 * Get the public S3 URL for a given object key.
 */
function getS3Url(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Generate a unique object key for upload.
 * @param {string} folder - S3 folder (e.g. 'course-thumbnails', 'brochures')
 * @param {string} originalName - Original filename
 * @returns {string} S3 object key
 */
function generateObjectKey(folder, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  const uniqueId = crypto.randomBytes(6).toString('hex');
  return `${folder}/${baseName}-${uniqueId}${ext}`;
}

/**
 * Upload a buffer to S3.
 * @param {Object} params
 * @param {Buffer} params.buffer - File content
 * @param {string} params.key - S3 object key
 * @param {string} params.contentType - MIME type
 * @returns {Promise<string>} Public S3 URL
 */
async function uploadToS3({ buffer, key, contentType }) {
  const command = new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3Client.send(command);
  return getS3Url(key);
}

/**
 * Delete an object from S3 by its key.
 * @param {string} key - S3 object key
 */
async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key:    key,
  });
  await s3Client.send(command);
}

/**
 * Extract S3 object key from a full S3 URL.
 * @param {string} url - Full S3 URL
 * @returns {string|null} Object key or null
 */
function getKeyFromUrl(url) {
  if (!url) return null;
  const prefix = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;
  if (url.startsWith(prefix)) {
    return url.slice(prefix.length);
  }
  return null;
}

/**
 * Convert a local public path (e.g. '/images/team.jpg') to the corresponding S3 URL.
 * Assumes the files were uploaded to S3 preserving folder structure (without leading slash).
 * @param {string} localPath - Path like '/images/team.jpg' or '/course-thumbnails/ai.webp'
 * @returns {string} S3 URL
 */
function localPathToS3Url(localPath) {
  if (!localPath) return '';
  // Already an S3 or external URL
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath;
  }
  // Remove leading slash
  const key = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  return getS3Url(key);
}

module.exports = {
  s3Client,
  BUCKET,
  REGION,
  getS3Url,
  generateObjectKey,
  uploadToS3,
  deleteFromS3,
  getKeyFromUrl,
  localPathToS3Url,
};
