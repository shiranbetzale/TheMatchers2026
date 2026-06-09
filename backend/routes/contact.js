const express = require('express');
const {getFirestore} = require('../config/firebase');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/status', (_req, res) => {
  res.json({
    ok: true,
    contact: {
      storage: 'firestore',
      collection: 'contactRequests',
      isConfigured: true,
    },
  });
});

router.post('/', async (req, res) => {
  try {
    const {name, email, phone = '', message} = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanMessage = String(message || '').trim();

    const missingField = [
      ['name', cleanName],
      ['email', cleanEmail],
      ['message', cleanMessage],
    ].find(([, value]) => !value)?.[0];

    if (missingField) {
      return res.status(400).json({
        error: 'missing_field',
        field: missingField,
        message: `Missing required field: ${missingField}`,
      });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: 'invalid_email',
        field: 'email',
        message: 'Invalid email format',
      });
    }

    const db = getFirestore();

    const docRef = await db.collection('contactRequests').add({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      status: 'new',
      source: 'thematchers-app',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      ok: true,
      id: docRef.id,
      message: 'Contact request saved successfully',
    });
  } catch (err) {
    console.error('[contact] save failed', {
      message: err?.message,
      code: err?.code,
    });

    return res.status(500).json({
      error: 'contact_save_failed',
      message: err?.message || 'Failed to save contact request',
      code: err?.code || undefined,
    });
  }
});

module.exports = router;
