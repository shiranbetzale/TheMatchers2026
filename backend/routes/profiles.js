const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');
const {
  notifyProfileCreated,
  notifyProfileRelationshipStatus,
} = require('../services/pushNotifications');

const router = express.Router();

function logDev(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function getProfileName(profile) {
  return profile?.fullName || profile?.name || '';
}

function validateProfilePayload(payload) {
  const fullName = String(payload.fullName || payload.name || '').trim();
  const phone = String(payload.phone || '').trim();

  if (!fullName) {
    const error = new Error('Missing required field: fullName');
    error.status = 400;
    error.field = 'fullName';
    throw error;
  }

  if (!phone) {
    const error = new Error('Missing required field: phone');
    error.status = 400;
    error.field = 'phone';
    throw error;
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
        images: Array.isArray(profileData.images) ? profileData.images : [],
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
    String(profile.assignedMatchmaker || '') === String(user.id) ||
    String(profile.collaborationMatchmaker || '') === String(user.id)
  );
}

function assertProfileAccess(user, profile) {
  if (!profile) {
    const error = new Error('Profile not found');
    error.status = 404;
    throw error;
  }

  if (!canAccessProfile(user, profile)) {
    const error = new Error('Forbidden profile access');
    error.status = 403;
    throw error;
  }
}

async function resolvePartnerProfile(profile) {
  if (!profile || profile.partnerOutsideApp) {
    return null;
  }

  if (profile.partnerProfileId) {
    const partner = await Profile.findById(profile.partnerProfileId);

    if (partner) {
      return partner;
    }
  }

  const partnerName = normalizeName(profile.partnerName);

  if (!partnerName) {
    return null;
  }

  const profiles = await Profile.find({});

  return (
    profiles.find(
      item =>
        String(item.id) !== String(profile.id) &&
        normalizeName(getProfileName(item)) === partnerName,
    ) || null
  );
}

async function syncPartnerRelationship(profile, relationshipStatus) {
  if (relationshipStatus !== 'engaged' && relationshipStatus !== 'married') {
    return null;
  }

  const partner = await resolvePartnerProfile(profile);

  if (!partner) {
    return null;
  }

  partner.status = 'archived';
  partner.archivedReason = relationshipStatus;
  partner.relationshipStatus = relationshipStatus;
  partner.partnerName = getProfileName(profile);
  partner.partnerProfileId = profile.id;
  partner.partnerOutsideApp = false;
  partner.collaborationMatchmaker = profile.collaborationMatchmaker || '';

  if (!profile.partnerProfileId) {
    profile.partnerProfileId = partner.id;
    profile.partnerOutsideApp = false;
    await profile.save();
  }

  await partner.save();
  return partner;
}

async function syncPartnerMeeting(profile, previousPartner = null) {
  const partner = (await resolvePartnerProfile(profile)) || previousPartner;

  if (!partner) {
    return null;
  }

  const meetingStatus = String(profile.meetingStatus || 'available');
  const isBusy = meetingStatus === 'busy';

  partner.met = isBusy;
  partner.meetingStatus = meetingStatus;
  partner.meetingDate = isBusy ? profile.meetingDate || '' : '';
  partner.meetingTime = isBusy ? profile.meetingTime || '' : '';
  partner.meetingLocation = isBusy ? profile.meetingLocation || '' : '';
  partner.partnerName = isBusy ? getProfileName(profile) : '';
  partner.partnerProfileId = isBusy ? profile.id : '';
  partner.partnerOutsideApp = false;
  partner.collaborationMatchmaker = isBusy
    ? profile.assignedMatchmaker || profile.collaborationMatchmaker || ''
    : '';
  partner.meetingReminderDayFor = '';
  partner.meetingReminderDaySentAt = undefined;
  partner.meetingReminderHourFor = '';
  partner.meetingReminderHourSentAt = undefined;

  await partner.save();

  if (isBusy && !profile.partnerProfileId) {
    profile.partnerProfileId = partner.id;
    profile.partnerOutsideApp = false;
    await profile.save();
  }

  return partner;
}

async function notifyRelationshipStatusOnce(profile, relationshipStatus) {
  if (relationshipStatus !== 'engaged' && relationshipStatus !== 'married') {
    return {skipped: true, reason: 'not_relationship_status'};
  }

  if (String(profile.relationshipNotifiedStatus || '') === relationshipStatus) {
    logDev('RELATIONSHIP PUSH SKIPPED: already notified', {
      profileId: profile.id,
      relationshipStatus,
    });
    return {skipped: true, reason: 'already_notified'};
  }

  const response = await notifyProfileRelationshipStatus(
    profile,
    relationshipStatus,
  );

  logDev('RELATIONSHIP PUSH RESULT:', {
    profileId: profile.id,
    relationshipStatus,
    successCount: response.successCount,
    failureCount: response.failureCount,
  });

  if (response.successCount > 0) {
    profile.relationshipNotifiedStatus = relationshipStatus;
    profile.relationshipNotifiedAt = new Date();
    await profile.save();
  }

  return {
    skipped: false,
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
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
          name: profile.fullName || profile.name,
          assignedMatchmaker: profile.assignedMatchmaker,
          status: profile.status,
          maritalStatus: profile.maritalStatus,
          relationshipStatus: profile.relationshipStatus,
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

      validateProfilePayload(payload);

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

router.get(
  '/:id',
  requireAuth(['admin', 'matchmaker']),
  async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.id);

      assertProfileAccess(req.user, profile);

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({profile: enrichedProfile});
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

      assertProfileAccess(req.user, profile);

      const previousRelationshipStatus = String(
        profile.relationshipStatus || '',
      );
      const hasMeetingUpdate =
        Object.prototype.hasOwnProperty.call(req.body, 'meetingDate') ||
        Object.prototype.hasOwnProperty.call(req.body, 'meetingTime') ||
        Object.prototype.hasOwnProperty.call(req.body, 'meetingStatus');
      const previousMeetingPartner = hasMeetingUpdate
        ? await resolvePartnerProfile(profile)
        : null;

      Object.assign(profile, req.body);

      if (hasMeetingUpdate) {
        const meetingStatus = String(profile.meetingStatus || 'available');
        const hasMeetingPartner = Boolean(
          String(profile.partnerProfileId || '').trim() ||
            String(profile.partnerName || '').trim(),
        );

        profile.met = meetingStatus === 'busy' && hasMeetingPartner;
        profile.meetingReminderDayFor = '';
        profile.meetingReminderDaySentAt = undefined;
        profile.meetingReminderHourFor = '';
        profile.meetingReminderHourSentAt = undefined;
      }

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
        profile.relationshipStatus = '';
        profile.partnerName = '';
        profile.partnerProfileId = '';
        profile.partnerOutsideApp = false;
        profile.collaborationMatchmaker = '';
        profile.relationshipNotifiedStatus = '';
        profile.relationshipNotifiedAt = undefined;
      } else if (!relationshipStatus) {
        profile.relationshipNotifiedStatus = '';
        profile.relationshipNotifiedAt = undefined;
      }

      await profile.save();
      await syncPartnerRelationship(profile, relationshipStatus);
      const syncedMeetingPartner = hasMeetingUpdate
        ? await syncPartnerMeeting(profile, previousMeetingPartner)
        : null;

      let notificationResult = null;

      if (
        relationshipStatus !== previousRelationshipStatus ||
        String(profile.relationshipNotifiedStatus || '') !== relationshipStatus
      ) {
        notificationResult = await notifyRelationshipStatusOnce(
          profile,
          relationshipStatus,
        );
      }

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({
        profile: enrichedProfile,
        notification: notificationResult,
        syncedMeetingPartner: syncedMeetingPartner
          ? syncedMeetingPartner.id
          : null,
      });
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

      assertProfileAccess(req.user, profile);

      profile.status = 'archived';
      profile.archivedReason = req.body.reason || 'married';

      const previousRelationshipStatus = String(
        profile.relationshipStatus || '',
      );

      if (req.body.reason === 'engaged' || req.body.reason === 'married') {
        profile.relationshipStatus = req.body.reason;
      }

      await profile.save();

      const relationshipStatus = String(profile.relationshipStatus || '');
      await syncPartnerRelationship(profile, relationshipStatus);

      let notificationResult = null;

      if (
        relationshipStatus !== previousRelationshipStatus ||
        String(profile.relationshipNotifiedStatus || '') !== relationshipStatus
      ) {
        notificationResult = await notifyRelationshipStatusOnce(
          profile,
          relationshipStatus,
        );
      }

      const [enrichedProfile] = await enrichProfilesWithMatcher(profile);

      res.json({profile: enrichedProfile, notification: notificationResult});
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

      assertProfileAccess(req.user, profile);

      profile.status = 'active';
      profile.relationshipStatus = 'single';
      profile.archivedReason = '';
      profile.partnerName = '';
      profile.partnerProfileId = '';
      profile.partnerOutsideApp = false;
      profile.collaborationMatchmaker = '';
      profile.relationshipNotifiedStatus = '';
      profile.relationshipNotifiedAt = undefined;

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
