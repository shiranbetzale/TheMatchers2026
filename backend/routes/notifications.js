const express = require('express');
const DeviceToken = require('../models/DeviceToken');
const {requireAuth} = require('../middleware/auth');

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

    const tokens = await DeviceToken.find({});
    const existingToken = tokens.find(item => item.token === token);

    if (existingToken) {
      existingToken.user = req.user.id;
      existingToken.platform = platform;
      existingToken.lastSeenAt = new Date();
      await existingToken.save();
    } else {
      const deviceToken = new DeviceToken({
        user: req.user.id,
        token,
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
      await existingToken.delete();
    }

    res.json({ok: true});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
