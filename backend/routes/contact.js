const express = require('express');
const {getFirestore} = require('../config/firebase');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeContactRequest(doc) {
  const data = doc.data() || {};
  const toIso = value => {
    if (!value) {
      return '';
    }

    if (typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  };

  return {
    id: doc.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    message: data.message || '',
    status: data.status || 'new',
    emailSent: Boolean(data.emailSent),
    emailError: data.emailError || '',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    readAt: toIso(data.readAt),
    handledAt: toIso(data.handledAt),
  };
}

router.get('/status', (_req, res) => {
  res.json({
    ok: true,
    contact: {
      storage: 'firestore',
      collection: 'contactRequests',
      deliveryMode: 'in_app_requests',
      isConfigured: true,
    },
  });
});

router.get('/requests', requireAuth(['admin']), async (_req, res) => {
  try {
    const snapshot = await getFirestore()
      .collection('contactRequests')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    res.json({
      requests: snapshot.docs.map(normalizeContactRequest),
    });
  } catch (err) {
    console.error('[contact] requests list failed', {
      message: err?.message,
      code: err?.code,
    });

    res.status(500).json({
      error: 'contact_requests_failed',
      message: err?.message || 'Failed to load contact requests',
    });
  }
});

router.patch('/requests/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const action = String(req.body?.action || '').trim();

    if (action !== 'read' && action !== 'handled') {
      return res.status(400).json({
        error: 'invalid_action',
        message: 'action must be read or handled',
      });
    }

    const docRef = getFirestore().collection('contactRequests').doc(req.params.id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: 'contact_request_not_found',
        message: 'Contact request not found',
      });
    }

    const now = new Date();
    const update =
      action === 'handled'
        ? {
            status: 'handled',
            readAt: snapshot.data()?.readAt || now,
            handledAt: now,
            updatedAt: now,
          }
        : {
            status:
              snapshot.data()?.status === 'handled' ? 'handled' : 'read',
            readAt: snapshot.data()?.readAt || now,
            updatedAt: now,
          };

    await docRef.update(update);

    const updatedSnapshot = await docRef.get();

    res.json({
      request: normalizeContactRequest(updatedSnapshot),
    });
  } catch (err) {
    console.error('[contact] request update failed', {
      message: err?.message,
      code: err?.code,
    });

    res.status(500).json({
      error: 'contact_request_update_failed',
      message: err?.message || 'Failed to update contact request',
    });
  }
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
      emailSent: false,
      emailSkipped: true,
      emailError: '',
      deliveryMode: 'in_app_requests',
      source: 'thematchers-app',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      ok: true,
      id: docRef.id,
      saved: true,
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
