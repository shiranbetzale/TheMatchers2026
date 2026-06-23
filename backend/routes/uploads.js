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
    files: 2,
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

const isStorageCredentialError = error => {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === 'invalid_firebase_service_account' ||
    message.includes('googleapis.com/oauth2') ||
    message.includes('application default credentials') ||
    message.includes('could not load the default credentials') ||
    message.includes('premature close')
  );
};

router.post(
  '/profile-images',
  requireAuth(['admin', 'matchmaker']),
  upload.array('images', 2),
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
      console.log('[uploads] uploading profile images', {
        bucket: bucket.name,
        fileCount: files.length,
        userId: req.user.id,
      });
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
      const isCredentialError = isStorageCredentialError(error);

      console.error('[uploads] profile image upload failed', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        storageConfigured: !isCredentialError,
      });

      if (isCredentialError) {
        return res.status(503).json({
          error: 'storage_not_configured',
          message:
            'Image upload storage is not configured. Check FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_STORAGE_BUCKET.',
        });
      }

      next(error);
    }
  },
);

module.exports = router;
