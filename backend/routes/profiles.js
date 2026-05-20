const express = require('express');
const Profile = require('../models/Profile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function canAccessProfile(user, profile) {
  if (!profile) return false;
  return user.role === 'admin' || profile.assignedMatchmaker.toString() === user.id;
}

router.get('/', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (req.user.role !== 'admin') {
      query.assignedMatchmaker = req.user.id;
    }
    if (status) query.status = status;

    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    res.json({ profiles });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      assignedMatchmaker: req.user.id,
    };
    const profile = await Profile.create(payload);
    res.status(201).json({ profile });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || !canAccessProfile(req.user, profile)) {
      const error = new Error('Profile not found');
      error.status = 404;
      throw error;
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/archive', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || !canAccessProfile(req.user, profile)) {
      const error = new Error('Profile not found');
      error.status = 404;
      throw error;
    }
    profile.status = 'archived';
    profile.archivedReason = req.body.reason || 'married';
    await profile.save();
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
