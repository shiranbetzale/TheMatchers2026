const admin = require('firebase-admin');
const {getFirebaseApp} = require('../config/firebase');
const DeviceToken = require('../models/DeviceToken');
const User = require('../models/User');
const Profile = require('../models/Profile');

async function getMatchmakerTokens() {
  const users = await User.find({
    isActive: true,
    role: {$in: ['admin', 'matchmaker']},
  }).select('_id');

  const userIds = users.map(user => user._id);
  const deviceTokens = await DeviceToken.find({user: {$in: userIds}}).select(
    'token',
  );

  return deviceTokens.map(device => device.token);
}

async function sendPushNotification({title, body, data = {}, tokens}) {
  const app = getFirebaseApp();

  if (!app) {
    console.warn('Firebase push is not configured; notification skipped');
    return {successCount: 0, failureCount: 0};
  }

  const targetTokens = tokens || (await getMatchmakerTokens());

  if (!targetTokens.length) {
    return {successCount: 0, failureCount: 0};
  }

  const messaging = admin.messaging(app);
  const response = await messaging.sendEachForMulticast({
    tokens: targetTokens,
    notification: {title, body},
    data: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)]),
    ),
  });

  const invalidTokens = response.responses
    .map((result, index) => ({result, token: targetTokens[index]}))
    .filter(({result}) => {
      const code = result.error?.code;
      return (
        code === 'messaging/invalid-registration-token' ||
        code === 'messaging/registration-token-not-registered'
      );
    })
    .map(({token}) => token);

  if (invalidTokens.length) {
    await DeviceToken.deleteMany({token: {$in: invalidTokens}});
  }

  return response;
}

async function notifyProfileCreated(profile) {
  return sendPushNotification({
    title: 'כרטיס חדש נוסף',
    body: `${profile.fullName} נוסף/ה למאגר השידוכים`,
    data: {
      type: 'profile_created',
      profileId: profile.id,
    },
  });
}

async function notifyRelationshipStatus(match, status) {
  const candidate =
    typeof match.candidate === 'object'
      ? match.candidate
      : await Profile.findById(match.candidate);
  const matchWith =
    typeof match.matchWith === 'object'
      ? match.matchWith
      : await Profile.findById(match.matchWith);

  if (!candidate || !matchWith) {
    return {successCount: 0, failureCount: 0};
  }

  const statusText = status === 'married' ? 'התחתנו' : 'התארסו';
  return sendPushNotification({
    title: 'מזל טוב!',
    body: `${candidate.fullName} ו-${matchWith.fullName} ${statusText}`,
    data: {
      type: 'relationship_status',
      matchId: match.id,
      status,
    },
  });
}

module.exports = {
  notifyProfileCreated,
  notifyRelationshipStatus,
  sendPushNotification,
};
