/**
 * Media URL Utility
 * Converts local paths stored in MongoDB to S3 URLs when serving API responses.
 * This provides backward compatibility — old records with local paths
 * like '/course-thumbnails/ai.webp' are automatically converted to S3 URLs.
 */

const { localPathToS3Url } = require('../config/s3');

/**
 * List of fields that may contain media URLs/paths.
 */
const MEDIA_FIELDS = ['thumbnailUrl', 'brochureUrl', 'pdfUrl', 'avatar', 'imageUrl', 'photoUrl', 'logoUrl', 'certificateUrl'];

/**
 * Transform a single document's media fields from local paths to S3 URLs.
 * Leaves already-absolute URLs untouched.
 * @param {Object} doc - A plain object (lean document)
 * @returns {Object} Same object with media fields converted
 */
function transformMediaUrls(doc) {
  if (!doc || typeof doc !== 'object') return doc;

  for (const field of MEDIA_FIELDS) {
    if (doc[field] && typeof doc[field] === 'string') {
      doc[field] = localPathToS3Url(doc[field]);
    }
  }

  return doc;
}

/**
 * Transform an array of documents.
 * @param {Array} docs
 * @returns {Array}
 */
function transformMediaUrlsArray(docs) {
  if (!Array.isArray(docs)) return docs;
  return docs.map(transformMediaUrls);
}

module.exports = { transformMediaUrls, transformMediaUrlsArray, MEDIA_FIELDS };
