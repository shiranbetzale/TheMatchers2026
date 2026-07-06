const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

const isArchivedProfile = profile =>
  profile.status === 'archived' ||
  profile.relationshipStatus === 'engaged' ||
  profile.relationshipStatus === 'married';

router.get('/', requireAuth(['admin']), async (_req, res, next) => {
  try {
    const profiles = await Profile.find({});
    const users = await User.find({});
    const activeProfiles = profiles.filter(profile => !isArchivedProfile(profile));
    const archivedProfiles = profiles.filter(isArchivedProfile);

    res.json({
      stats: {
        profiles: {
          total: profiles.length,
          active: activeProfiles.length,
          archived: archivedProfiles.length,
          engaged: profiles.filter(profile => profile.relationshipStatus === 'engaged').length,
          married: profiles.filter(profile => profile.relationshipStatus === 'married').length,
        },
        users: {
          total: users.length,
          active: users.filter(user => user.isActive !== false).length,
          inactive: users.filter(user => user.isActive === false).length,
          admins: users.filter(user => user.role === 'admin').length,
          matchmakers: users.filter(user => user.role === 'matchmaker').length,
          candidates: users.filter(user => user.role === 'user').length,
        },
        meetings: {
          busy: profiles.filter(profile => profile.meetingStatus === 'busy').length,
          available: profiles.filter(profile => profile.meetingStatus !== 'busy').length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
