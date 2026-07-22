/**
 * Upload Routes — /api/upload
 * Admin-only endpoints for uploading media to S3.
 */

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { upload, uploadImage, uploadPdf } = require('../middleware/upload');
const { uploadToS3, generateObjectKey, deleteFromS3, getKeyFromUrl } = require('../config/s3');

const router = express.Router();
const adminOnly = [authenticate, authorize('ADMIN', 'SUPERADMIN')];

/**
 * POST /api/upload/image
 * Upload a single image to S3.
 * Body (multipart): file, folder (optional, defaults to 'images')
 * Returns: { success: true, url: '...' }
 */
router.post('/image', ...adminOnly, uploadImage.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'images';
    const key = generateObjectKey(folder, req.file.originalname);
    const url = await uploadToS3({
      buffer:      req.file.buffer,
      key,
      contentType: req.file.mimetype,
    });

    res.json({ success: true, url, key });
  } catch (err) { next(err); }
});

/**
 * POST /api/upload/pdf
 * Upload a single PDF to S3.
 * Body (multipart): file, folder (optional, defaults to 'brochures')
 */
router.post('/pdf', ...adminOnly, uploadPdf.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'brochures';
    const key = generateObjectKey(folder, req.file.originalname);
    const url = await uploadToS3({
      buffer:      req.file.buffer,
      key,
      contentType: req.file.mimetype,
    });

    res.json({ success: true, url, key });
  } catch (err) { next(err); }
});

/**
 * POST /api/upload/video
 * Upload a single video to S3.
 * Body (multipart): file, folder (optional, defaults to 'videos')
 */
router.post('/video', ...adminOnly, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'videos';
    const key = generateObjectKey(folder, req.file.originalname);
    const url = await uploadToS3({
      buffer:      req.file.buffer,
      key,
      contentType: req.file.mimetype,
    });

    res.json({ success: true, url, key });
  } catch (err) { next(err); }
});

/**
 * POST /api/upload/any
 * Upload any allowed file type to S3.
 * Body (multipart): file, folder (required)
 */
router.post('/any', ...adminOnly, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    if (!req.body.folder) {
      return res.status(400).json({ error: 'Folder is required' });
    }

    const key = generateObjectKey(req.body.folder, req.file.originalname);
    const url = await uploadToS3({
      buffer:      req.file.buffer,
      key,
      contentType: req.file.mimetype,
    });

    res.json({ success: true, url, key });
  } catch (err) { next(err); }
});

/**
 * DELETE /api/upload
 * Delete a file from S3 by URL.
 * Body: { url: '...' }
 */
router.delete('/', ...adminOnly, async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const key = getKeyFromUrl(url);
    if (!key) return res.status(400).json({ error: 'Invalid S3 URL' });

    await deleteFromS3(key);
    res.json({ success: true, message: 'File deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
