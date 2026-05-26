const express = require('express');
const Profile = require('../models/Profile');
const Match = require('../models/Match');
const { requireAuth } = require('../middleware/auth');
const {notifyRelationshipStatus} = require('../services/pushNotifications');

const router = express.Router();

async function loadProfiles(candidateId, matchWithId) {
  const [candidate, matchWith] = await Promise.all([
    Profile.findById(candidateId),
    Profile.findById(matchWithId),
  ]);
  return { candidate, matchWith };
}

function ensureAccess(user, profile) {
  return (
    user.role === 'admin' || String(profile.assignedMatchmaker || '') === user.id
  );
}

router.get('/', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.owner = req.user.id;
    }
    const matches = await Match.find(query)
      .populate('candidate')
      .populate('matchWith')
      .sort({ createdAt: -1 });
    res.json({ matches });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const { candidateId, matchWithId, notes } = req.body;
    if (!candidateId || !matchWithId) {
      const error = new Error('candidateId and matchWithId are required');
      error.status = 400;
      throw error;
    }

    const { candidate, matchWith } = await loadProfiles(candidateId, matchWithId);
    if (!candidate || !matchWith) {
      const error = new Error('Profiles not found');
      error.status = 404;
      throw error;
    }

    if (req.user.role !== 'admin' && !ensureAccess(req.user, candidate)) {
      const error = new Error('Not allowed to match this candidate');
      error.status = 403;
      throw error;
    }

    const match = await Match.create({
      candidate: candidate.id,
      matchWith: matchWith.id,
      owner: req.user.id,
      notes,
    });

    res.status(201).json({ match });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const { status, notes, notified } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) {
      const error = new Error('Match not found');
      error.status = 404;
      throw error;
    }

    if (req.user.role !== 'admin' && String(match.owner || '') !== req.user.id) {
      const error = new Error('Not allowed to update this match');
      error.status = 403;
      throw error;
    }

    const previousStatus = match.status;
    if (status) match.status = status;
    if (notes !== undefined) match.notes = notes;
    if (notified) {
      match.notified = true;
      match.notifiedAt = new Date();
    }

    await match.save();

    if (
      status &&
      status !== previousStatus &&
      (status === 'engaged' || status === 'married')
    ) {
      notifyRelationshipStatus(match, status).catch(error => {
        console.warn('Failed to send relationship-status push notification', error);
      });
    }

    res.json({ match });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/share-link', requireAuth(['admin', 'matchmaker']), async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('candidate')
      .populate('matchWith')
      .populate({
        path: 'candidate',
        populate: { path: 'assignedMatchmaker', model: 'User' },
      })
      .populate({
        path: 'matchWith',
        populate: { path: 'assignedMatchmaker', model: 'User' },
      });

    if (!match) {
      const error = new Error('Match not found');
      error.status = 404;
      throw error;
    }

    if (req.user.role !== 'admin' && String(match.owner || '') !== req.user.id) {
      const error = new Error('Not allowed to share this match');
      error.status = 403;
      throw error;
    }

    const candidate = match.candidate;
    const matchWith = match.matchWith;
    const targetMatchmakerPhone = matchWith.assignedMatchmaker?.phone;

    const message = [
      'התאמה חדשה:',
      `משודך: ${candidate.fullName} (${candidate.phone})`,
      `התאמה עם: ${matchWith.fullName} (${matchWith.phone})`,
      match.notes ? `הערות: ${match.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const encoded = encodeURIComponent(message);
    const link = targetMatchmakerPhone
      ? `https://wa.me/${targetMatchmakerPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    res.json({ link, message });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
