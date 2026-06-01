const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const {connectToDatabase} = require('../config/db');
const DeviceToken = require('../models/DeviceToken');
const {sendPushNotification} = require('../services/pushNotifications');

const platform = process.argv[2] || 'all';
const allowedPlatforms = ['all', 'android', 'ios'];

async function sendDemoPush() {
  if (!allowedPlatforms.includes(platform)) {
    throw new Error('Platform must be one of: all, android, ios');
  }

  await connectToDatabase();

  const query = platform === 'all' ? {} : {platform};
  const devices = await DeviceToken.find(query);

  const tokens = devices.map(device => device.token).filter(Boolean);
  
  if (!tokens.length) {
    console.log(`No ${platform} device tokens found`);
    return;
  }

  const response = await sendPushNotification({
    tokens,
    title: 'התראת בדיקה',
    body:
      platform === 'all'
        ? 'זוהי התראת demo לכל המכשירים'
        : `זוהי התראת demo ל-${platform}`,
    data: {
      type: 'demo',
      platform,
      sentAt: new Date().toISOString(),
    },
  });

  console.log(
    `Demo push sent to ${tokens.length} ${platform} token(s). success=${response.successCount}, failure=${response.failureCount}`,
  );

  if (response.failureCount > 0 && response.responses) {
    response.responses.forEach((result, index) => {
      if (!result.success) {
        console.log('Push failure detail', {
          platform: devices[index]?.platform,
          token: tokens[index]?.slice(0, 16),
          code: result.error?.code,
          message: result.error?.message,
        });
      }
    });
  }
}

sendDemoPush().catch(error => {
  console.error('Failed to send demo push', error);
  process.exitCode = 1;
});
