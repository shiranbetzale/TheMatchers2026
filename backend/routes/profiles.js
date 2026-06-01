const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');
const {notifyProfileCreated} = require('../services/pushNotifications');

const router = express.Router();

function logDev(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

async function enrichProfilesWithMatcher(profiles) {
  const list = Array.isArray(profiles) ? profiles : [profiles];

  const matchmakerIds = Array.from(
    new Set(
      list
        .map(profile => String(profile?.assignedMatchmaker || '').trim())
        .filter(Boolean),
    ),
  );

  if (!matchmakerIds.length) {
    return list.map(profile => {
      const profileData =
        typeof profile.toJSON === 'function' ? profile.toJSON() : profile;

      return {
        ...profileData,
        images:
          Array.isArray(profileData.images) && profileData.images.length
            ? profileData.images
            : [DEFAULT_PROFILE_IMAGE],
      };
    });
  }

  const users = await User.find({});
  const usersById = new Map(users.map(user => [String(user.id), user]));

  return list.map(profile => {
    const profileData =
      typeof profile.toJSON === 'function' ? profile.toJSON() : profile;

    const assignedId = String(profileData.assignedMatchmaker || '');
    const matchmaker = usersById.get(assignedId);

    return {
      ...profileData,
      matcherName: profileData.matcherName || matchmaker?.fullName || '',
      matcherPhone: profileData.matcherPhone || matchmaker?.phone || '',
      matcherMail: profileData.matcherMail || matchmaker?.email || '',
      images: profileData.images,
    };
  });
}

function canAccessProfile(user, profile) {
  if (!profile) {
    return false;
  }

  return (
    user.role === 'admin' ||
    String(profile.assignedMatchmaker || '') === String(user.id)
  );
}

router.get(
  '/',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const {status, scope} = req.query;
      const query = {};

      if (scope === 'mine') {
        query.assignedMatchmaker = req.user.id;
      }

      const profiles = await Profile.find(query);

      logDev('GET PROFILES:', {
        scope,
        userId: req.user.id,
        found: profiles.length,
        assigned: profiles.map(profile => ({
          name: profile.fullName,
          assignedMatchmaker: profile.assignedMatchmaker,
        })),
      });

      const filteredProfiles = profiles.filter(profile => {
        const profileStatus = String(profile.status || '');
        const relationshipStatus = String(profile.relationshipStatus || '');

        const isArchived =
          profileStatus === 'archived' ||
          relationshipStatus === 'engaged' ||
          relationshipStatus === 'married';

        if (status === 'archived') {
          return isArchived;
        }

        return !isArchived;
      });

      filteredProfiles.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return bTime - aTime;
      });

      const enrichedProfiles =
        await enrichProfilesWithMatcher(filteredProfiles);

      res.json({profiles: enrichedProfiles});
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const payload = {
        ...req.body,
        assignedMatchmaker: req.user.id,
        matcherName: req.user.fullName || req.body.matcherName || '',
        matcherPhone: req.user.phone || req.body.matcherPhone || '',
        matcherMail: req.user.email || req.body.matcherMail || '',
      };

      const profile = await Profile.create(payload);
      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      notifyProfileCreated(profile).catch(error => {
        console.warn('Failed to send profile-created push notification', error);
      });

      res.status(201).json({profile: enrichedProfile});
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id);

      if (!profile || !canAccessProfile(req.user, profile)) {
        const error = new Error('Profile not found');
        error.status = 404;
        throw error;
      }

      Object.assign(profile, req.body);

      const relationshipStatus = String(profile.relationshipStatus || '');

      if (
        relationshipStatus === 'engaged' ||
        relationshipStatus === 'married'
      ) {
        profile.status = 'archived';
        profile.archivedReason = relationshipStatus;
      } else if (profile.status === 'archived') {
        profile.status = 'active';
        profile.archivedReason = '';
      }

      await profile.save();

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({profile: enrichedProfile});
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/:id/archive',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id);

      if (!profile || !canAccessProfile(req.user, profile)) {
        const error = new Error('Profile not found');
        error.status = 404;
        throw error;
      }

      profile.status = 'archived';
      profile.archivedReason = req.body.reason || 'married';

      if (req.body.reason === 'engaged' || req.body.reason === 'married') {
        profile.relationshipStatus = req.body.reason;
      }

      await profile.save();

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({profile: enrichedProfile});
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id/unarchive',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id);

      if (!profile || !canAccessProfile(req.user, profile)) {
        const error = new Error('Profile not found');
        error.status = 404;
        throw error;
      }

      profile.status = 'active';
      profile.relationshipStatus = 'single';
      profile.archivedReason = '';
      profile.partnerName = '';
      profile.partnerOutsideApp = false;

      await profile.save();

      logDev('AFTER UNARCHIVE:', {
        id: profile.id,
        status: profile.status,
        relationshipStatus: profile.relationshipStatus,
        archivedReason: profile.archivedReason,
      });

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({
        message: 'Profile restored successfully',
        profile: enrichedProfile,
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
