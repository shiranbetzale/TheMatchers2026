const express = require('express');
const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const Profile = require('../models/Profile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function generateCode() {
  return crypto.randomUUID().slice(0, 8);
}

// יצירת קוד הזמנה למשודך חדש
router.post('/', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const assignedMatchmaker = req.user.id;
    const { expiresInHours = 48 } = req.body;
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      code: generateCode(),
      assignedMatchmaker,
      expiresAt,
    });

    res.status(201).json({ invitation });
  } catch (error) {
    next(error);
  }
});

// מימוש קוד הזמנה: יצירת פרופיל משודך חדש
router.post('/claim', async (req, res, next) => {
  try {
    const { code, fullName, phone, email, gender, city, age } = req.body;
    if (!code || !fullName || !phone) {
      const error = new Error('code, fullName, phone are required');
      error.status = 400;
      throw error;
    }

    const invitation = await Invitation.findOne({ code, status: 'pending' });
    if (!invitation) {
      const error = new Error('Invalid or used code');
      error.status = 400;
      throw error;
    }

    const profile = await Profile.create({
      fullName,
      phone,
      email,
      gender,
      city,
      age,
      assignedMatchmaker: invitation.assignedMatchmaker,
    });

    invitation.status = 'claimed';
    invitation.claimedByProfile = profile.id;
    await invitation.save();

    res.status(201).json({ profile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
