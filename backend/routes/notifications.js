const express = require('express');
const DeviceToken = require('../models/DeviceToken');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

router.post('/device-token', requireAuth(), async (req, res, next) => {
  try {
    const {token, platform = 'unknown'} = req.body;

    if (!token) {
      const error = new Error('token is required');
      error.status = 400;
      throw error;
    }

    await DeviceToken.findOneAndUpdate(
      {token},
      {
        user: req.user.id,
        token,
        platform,
        lastSeenAt: new Date(),
      },
      {new: true, upsert: true, setDefaultsOnInsert: true},
    );

    res.json({ok: true});
  } catch (error) {
    next(error);
  }
});

router.delete('/device-token', requireAuth(), async (req, res, next) => {
  try {
    const {token} = req.body;

    if (token) {
      await DeviceToken.deleteOne({token, user: req.user.id});
    }

    res.json({ok: true});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
