const express = require('express');
const Profile = require('../models/Profile');
const Match = require('../models/Match');
const { requireAuth } = require('../middleware/auth');
const {notifyRelationshipStatus} = require('../services/pushNotifications');

const router = express.Router();

function getMeetingDateTime(match) {
  const meetingDate = match?.meetingDate ? new Date(match.meetingDate) : null;
  const timeMatch = String(match?.meetingTime || '').match(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
  );

  if (!meetingDate || Number.isNaN(meetingDate.getTime()) || !timeMatch) {
    return null;
  }

  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(meetingDate);
  const getPart = type =>
    dateParts.find(datePart => datePart.type === type)?.value;
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');

  if (!year || !month || !day) {
    return null;
  }

  const offsetName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    timeZoneName: 'longOffset',
  })
    .formatToParts(meetingDate)
    .find(datePart => datePart.type === 'timeZoneName')?.value;
  const offset = String(offsetName || 'GMT+02:00').replace('GMT', '');

  return new Date(
    `${year}-${month}-${day}T${timeMatch[1]}:${timeMatch[2]}:00${offset}`,
  );
}

function hasCompletedMeeting(match) {
  const meetingDateTime = getMeetingDateTime(match);

  return (
    String(match?.meetingStatus || '') === 'busy' &&
    Boolean(meetingDateTime && meetingDateTime.getTime() <= Date.now())
  );
}

function serializeMatch(match) {
  const data = typeof match.toJSON === 'function' ? match.toJSON() : match;

  return {
    ...data,
    met: hasCompletedMeeting(data),
  };
}

async function loadProfiles(candidateId, matchWithId) {
  const [candidate, matchWith] = await Promise.all([
    Profile.findById(candidateId),
    Profile.findById(matchWithId),
  ]);
  return { candidate, matchWith };
}

function ensureAccess(user, profile) {
  return (
    user.role === 'admin' ||
    String(profile.assignedMatchmaker || '') === user.id ||
    String(profile.collaborationMatchmaker || '') === user.id
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
    res.json({matches: matches.map(serializeMatch)});
  } catch (error) {
    next(error);
  }
});

router.put(
  '/tracking',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const {candidateId, matchWithId} = req.body;

      if (!candidateId || !matchWithId || candidateId === matchWithId) {
        const error = new Error(
          'Distinct candidateId and matchWithId are required',
        );
        error.status = 400;
        throw error;
      }

      const {candidate, matchWith} = await loadProfiles(
        candidateId,
        matchWithId,
      );

      if (!candidate || !matchWith) {
        const error = new Error('Profiles not found');
        error.status = 404;
        throw error;
      }

      if (req.user.role !== 'admin' && !ensureAccess(req.user, candidate)) {
        const error = new Error('Not allowed to track this match');
        error.status = 403;
        throw error;
      }

      let match = await Match.findOne({
        candidate: candidate.id,
        matchWith: matchWith.id,
      });

      if (!match) {
        match = new Match({
          candidate: candidate.id,
          matchWith: matchWith.id,
          owner: candidate.assignedMatchmaker || req.user.id,
        });
      }

      if (req.body.offered === true) {
        match.offered = true;
        match.offeredAt = new Date();
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'meetingStatus')) {
        const isBusy = req.body.meetingStatus === 'busy';
        match.meetingStatus = isBusy ? 'busy' : 'available';
        match.meetingDate = isBusy ? req.body.meetingDate || '' : '';
        match.meetingTime = isBusy ? req.body.meetingTime || '' : '';
        match.meetingLocation = isBusy ? req.body.meetingLocation || '' : '';
        match.met = hasCompletedMeeting(match);
      }

      await match.save();

      res.json({match: serializeMatch(match)});
    } catch (error) {
      next(error);
    }
  },
);

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
