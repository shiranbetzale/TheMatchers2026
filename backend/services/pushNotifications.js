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

  return Array.from(
    new Set(
      deviceTokens
        .map(device => String(device.token || '').trim())
        .filter(Boolean),
    ),
  );
}

async function getAllUserTokens() {
  const deviceTokens = await DeviceToken.find({}).select('token');

  return Array.from(
    new Set(
      deviceTokens
        .map(device => String(device.token || '').trim())
        .filter(Boolean),
    ),
  );
}

async function getUserTokens(userIds = []) {
  const cleanUserIds = Array.from(
    new Set(userIds.map(userId => String(userId || '').trim()).filter(Boolean)),
  );

  if (!cleanUserIds.length) {
    return [];
  }

  const deviceTokens = await DeviceToken.find({user: {$in: cleanUserIds}});

  return Array.from(
    new Set(
      deviceTokens
        .map(device => String(device.token || '').trim())
        .filter(Boolean),
    ),
  );
}

async function sendPushNotification({title, body, data = {}, tokens}) {
  const app = getFirebaseApp();

  if (!app) {
    console.warn('Firebase push is not configured; notification skipped');
    return {successCount: 0, failureCount: 0};
  }

  const targetTokens = Array.from(
    new Set(
      (tokens || (await getMatchmakerTokens()))
        .map(token => String(token || '').trim())
        .filter(Boolean),
    ),
  );

  if (!targetTokens.length) {
    console.warn('Push notification skipped: no device tokens found', {
      type: data.type,
    });
    return {successCount: 0, failureCount: 0};
  }

  console.log('Sending push notification', {
    type: data.type,
    tokens: targetTokens.length,
    title,
  });

  const messaging = admin.messaging(app);
  const response = await messaging.sendEachForMulticast({
    tokens: targetTokens,
    notification: {title, body},
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        priority: 'high',
      },
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
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

  console.log('Push notification result', {
    type: data.type,
    successCount: response.successCount,
    failureCount: response.failureCount,
  });

  if (response.failureCount > 0) {
    console.warn(
      'Push notification failures',
      response.responses
        .map((result, index) => ({
          tokenPrefix: targetTokens[index]?.slice(0, 12),
          code: result.error?.code,
          message: result.error?.message,
        }))
        .filter(item => item.code || item.message),
    );
  }

  return response;
}

function normalizeRelationshipStatus(status) {
  const normalizedStatus = String(status || '').trim().toLowerCase();

  if (
    normalizedStatus === 'married' ||
    normalizedStatus === 'marriedstatus' ||
    normalizedStatus === 'נשוי' ||
    normalizedStatus === 'נשואה' ||
    normalizedStatus === 'התחתנו'
  ) {
    return 'married';
  }

  return 'engaged';
}

async function notifyProfileCreated(profile) {
  const profileName = profile.fullName || profile.name || 'כרטיס חדש';

  return sendPushNotification({
    title: 'כרטיס חדש נוסף',
    body: `${profileName} נוסף/ה למאגר השידוכים`,
    data: {
      type: 'profile_created',
      profileId: profile.id,
    },
  });
}

async function notifyProfileRelationshipStatus(profile, status) {
  const relationshipStatus = normalizeRelationshipStatus(status);
  const profileName = profile.fullName || profile.name || 'משודך/ת';
  let partnerName = profile.partnerName || '';

  if (!partnerName && profile.partnerProfileId) {
    const partner = await Profile.findById(profile.partnerProfileId);
    partnerName = partner?.fullName || partner?.name || '';
  }

  const statusText = relationshipStatus === 'married' ? 'התחתנו' : 'התארסו';
  const body = partnerName
    ? `${profileName} ו-${partnerName} ${statusText}`
    : `${profileName} ${statusText}`;

  return sendPushNotification({
    title: 'מזל טוב!',
    body,
    data: {
      type: 'relationship_status',
      targetScreen: 'ArchiveScreen',
      profileId: profile.id,
      partnerProfileId: profile.partnerProfileId || '',
      status: relationshipStatus,
    },
    tokens: await getAllUserTokens(),
  });
}

async function notifyRelationshipStatus(match, status) {
  const relationshipStatus = normalizeRelationshipStatus(status);
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

  const statusText = relationshipStatus === 'married' ? 'התחתנו' : 'התארסו';
  return sendPushNotification({
    title: 'מזל טוב!',
    body: `${candidate.fullName} ו-${matchWith.fullName} ${statusText}`,
    data: {
      type: 'relationship_status',
      targetScreen: 'ArchiveScreen',
      matchId: match.id,
      status: relationshipStatus,
    },
    tokens: await getAllUserTokens(),
  });
}

async function notifyMeetingReminder(profile, reminderType, tokens) {
  const profileName = profile.fullName || profile.name || 'משודך/ת';
  const partnerName = profile.partnerName || '';
  const meetingTime = profile.meetingTime || '';
  const location = profile.meetingLocation || '';
  const reminderText = reminderType === 'day' ? 'מחר' : 'בעוד שעה';
  const coupleText = partnerName
    ? `${profileName} ו-${partnerName}`
    : profileName;
  const details = [meetingTime, location].filter(Boolean).join(', ');

  return sendPushNotification({
    title: 'תזכורת לפגישה',
    body: details
      ? `${coupleText}: הפגישה ${reminderText} (${details})`
      : `${coupleText}: הפגישה ${reminderText}`,
    data: {
      type: 'meeting_reminder',
      reminderType,
      profileId: profile.id,
      meetingDate: profile.meetingDate || '',
      meetingTime,
    },
    tokens,
  });
}

module.exports = {
  getUserTokens,
  notifyProfileCreated,
  notifyProfileRelationshipStatus,
  notifyMeetingReminder,
  notifyRelationshipStatus,
  sendPushNotification,
};
