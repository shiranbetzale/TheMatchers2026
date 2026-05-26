const {createFirestoreModel} = require('./firestoreModel');

module.exports = createFirestoreModel('deviceTokens', {
  modelName: 'DeviceToken',
  uniqueFields: ['token'],
  defaults: {
    platform: 'unknown',
  },
});
