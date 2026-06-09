const express = require('express');
const DeviceToken = require('../models/DeviceToken');
const {requireAuth} = require('../middleware/auth');
const {processMeetingReminders} = require('../services/meetingReminders');
const {sendPushNotification} = require('../services/pushNotifications');

const router = express.Router();

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

router.post('/device-token', requireAuth(), async (req, res, next) => {
  try {
    const {token, platform = 'unknown'} = req.body || {};

    if (!token) {
      throw createHttpError('token is required', 400);
    }

    const cleanToken = String(token || '').trim();
    const tokens = await DeviceToken.find({});
    const matchingTokens = tokens.filter(item => item.token === cleanToken);
    const [existingToken, ...duplicateTokens] = matchingTokens;

    if (existingToken) {
      existingToken.user = req.user.id;
      existingToken.token = cleanToken;
      existingToken.platform = platform;
      existingToken.lastSeenAt = new Date();
      await existingToken.save();

      if (duplicateTokens.length) {
        await Promise.all(
          duplicateTokens.map(item => DeviceToken.findByIdAndDelete(item.id)),
        );
      }
    } else {
      const deviceToken = new DeviceToken({
        user: req.user.id,
        token: cleanToken,
        platform,
        lastSeenAt: new Date(),
      });

      await deviceToken.save();
    }

    res.json({ok: true});
  } catch (error) {
    console.error('[notifications] device-token failed', error.message);
    next(error);
  }
});

router.delete('/device-token', requireAuth(), async (req, res, next) => {
  try {
    const {token} = req.body || {};

    if (!token) {
      return res.json({ok: true});
    }

    const tokens = await DeviceToken.find({});
    const existingToken = tokens.find(
      item => item.token === token && item.user === req.user.id,
    );

    if (existingToken) {
      await DeviceToken.findByIdAndDelete(existingToken.id);
    }

    res.json({ok: true});
  } catch (error) {
    next(error);
  }
});

router.post('/test', requireAuth(), async (req, res, next) => {
  try {
    const tokens = await DeviceToken.find({});
    const userTokens = tokens
      .filter(item => String(item.user || '') === String(req.user.id))
      .map(item => String(item.token || '').trim())
      .filter(Boolean);

    if (!userTokens.length) {
      return res.status(404).json({
        ok: false,
        message: 'No device token found for current user',
      });
    }

    const response = await sendPushNotification({
      tokens: userTokens,
      title: 'התראת בדיקה',
      body: 'אם קיבלת את זה, נוטיפיקציות עובדות במכשיר הזה',
      data: {
        type: 'test_push',
        userId: req.user.id,
        sentAt: new Date().toISOString(),
      },
    });

    res.json({
      ok: response.successCount > 0,
      tokenCount: userTokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/meeting-reminders/run',
  requireAuth(['admin']),
  async (_req, res, next) => {
    try {
      await processMeetingReminders();
      res.json({ok: true});
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
