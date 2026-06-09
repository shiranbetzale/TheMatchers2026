const crypto = require('crypto');
const express = require('express');
const multer = require('multer');

const {requireAuth} = require('../middleware/auth');
const {getStorageBucket} = require('../config/firebase');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

const getFileExtension = file => {
  const originalName = String(file.originalname || '');
  const originalExtension = originalName.includes('.')
    ? originalName.split('.').pop()
    : '';
  const mimeExtension = String(file.mimetype || '').split('/')[1] || '';

  return (originalExtension || mimeExtension || 'jpg')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
};

router.post(
  '/profile-images',
  requireAuth(['admin', 'matchmaker']),
  upload.array('images', 6),
  async (req, res, next) => {
    try {
      const files = Array.isArray(req.files) ? req.files : [];

      if (!files.length) {
        return res.status(400).json({
          error: 'missing_files',
          message: 'No images were uploaded',
        });
      }

      const bucket = getStorageBucket();
      const urls = await Promise.all(
        files.map(async file => {
          const token = crypto.randomUUID();
          const extension = getFileExtension(file);
          const path = [
            'profile-images',
            String(req.user.id),
            `${Date.now()}-${crypto.randomUUID()}.${extension}`,
          ].join('/');
          const storageFile = bucket.file(path);

          await storageFile.save(file.buffer, {
            contentType: file.mimetype || 'image/jpeg',
            metadata: {
              metadata: {
                firebaseStorageDownloadTokens: token,
              },
            },
          });

          return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
            path,
          )}?alt=media&token=${token}`;
        }),
      );

      return res.status(201).json({urls});
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
