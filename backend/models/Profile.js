const {createFirestoreModel} = require('./firestoreModel');

module.exports = createFirestoreModel('profiles', {
  modelName: 'Profile',
  uniqueFields: ['phone'],
  defaults: {
    preferences: {},
    tags: [],
    status: 'active',
  },
});
