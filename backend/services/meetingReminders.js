const Profile = require('../models/Profile');
const User = require('../models/User');
const {getUserTokens, notifyMeetingReminder} = require('./pushNotifications');

const REMINDER_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

let reminderInterval;
let isReminderRunActive = false;

function normalizePhone(phone) {
  const normalizedPhone = String(phone || '').replace(/\D/g, '');

  if (normalizedPhone.startsWith('972')) {
    return `0${normalizedPhone.slice(3)}`;
  }

  return normalizedPhone;
}

function getMeetingDateTime(profile) {
  const meetingDate = profile.meetingDate ? new Date(profile.meetingDate) : null;
  const meetingTime = String(profile.meetingTime || '').trim();
  const match = meetingTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  if (!meetingDate || Number.isNaN(meetingDate.getTime()) || !match) {
    return null;
  }

  const meetingDateTime = new Date(meetingDate);
  meetingDateTime.setHours(Number(match[1]), Number(match[2]), 0, 0);

  return meetingDateTime;
}

function getReminderMeetingKey(meetingDateTime) {
  return meetingDateTime.toISOString();
}

async function getReminderUserIds(profile) {
  const userIds = [
    profile.assignedMatchmaker,
    profile.collaborationMatchmaker,
  ].filter(Boolean);
  const candidatePhone = normalizePhone(profile.phone);

  if (candidatePhone) {
    const users = await User.find({});
    const candidateUser = users.find(
      user =>
        user.role === 'user' && normalizePhone(user.phone) === candidatePhone,
    );

    if (candidateUser) {
      userIds.push(candidateUser.id);
    }
  }

  return Array.from(
    new Set(userIds.map(userId => String(userId || '').trim()).filter(Boolean)),
  );
}

async function sendReminder(profile, reminderType, meetingKey) {
  const userIds = await getReminderUserIds(profile);
  const tokens = await getUserTokens(userIds);

  if (!tokens.length) {
    console.warn('Meeting reminder skipped: no tokens', {
      profileId: profile.id,
      reminderType,
      userIds,
    });
    return;
  }

  const response = await notifyMeetingReminder(profile, reminderType, tokens);

  if (response.successCount > 0) {
    if (reminderType === 'day') {
      profile.meetingReminderDayFor = meetingKey;
      profile.meetingReminderDaySentAt = new Date();
    } else {
      profile.meetingReminderHourFor = meetingKey;
      profile.meetingReminderHourSentAt = new Date();
    }

    await profile.save();
  }
}

async function processMeetingReminders() {
  if (isReminderRunActive) {
    return;
  }

  isReminderRunActive = true;

  try {
    const profiles = await Profile.find({});
    const now = Date.now();

    for (const profile of profiles) {
      if (profile.meetingStatus !== 'busy') {
        continue;
      }

      const meetingDateTime = getMeetingDateTime(profile);

      if (!meetingDateTime) {
        continue;
      }

      const diffMs = meetingDateTime.getTime() - now;

      if (diffMs <= 0 || diffMs > DAY_MS) {
        continue;
      }

      const meetingKey = getReminderMeetingKey(meetingDateTime);

      if (
        diffMs <= HOUR_MS &&
        String(profile.meetingReminderHourFor || '') !== meetingKey
      ) {
        await sendReminder(profile, 'hour', meetingKey);
        continue;
      }

      if (
        diffMs > HOUR_MS &&
        String(profile.meetingReminderDayFor || '') !== meetingKey
      ) {
        await sendReminder(profile, 'day', meetingKey);
      }
    }
  } catch (error) {
    console.warn('Meeting reminder job failed', error);
  } finally {
    isReminderRunActive = false;
  }
}

function startMeetingReminderScheduler() {
  if (reminderInterval) {
    return;
  }

  processMeetingReminders();
  reminderInterval = setInterval(
    processMeetingReminders,
    REMINDER_CHECK_INTERVAL_MS,
  );
}

module.exports = {
  processMeetingReminders,
  startMeetingReminderScheduler,
};
