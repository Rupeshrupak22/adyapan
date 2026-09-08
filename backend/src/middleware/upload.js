/**
 * Multer Upload Middleware
 * Stores files in memory buffer for direct S3 upload (no disk storage).
 */

const multer = require('multer');

const storage = multer.memoryStorage();

// File filter for common media types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif',
    'application/pdf',
    'video/mp4', 'video/webm',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Single file upload (max 50MB for videos)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Image-only upload (max 10MB)
const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// PDF-only upload (max 20MB)
const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = { upload, uploadImage, uploadPdf };
