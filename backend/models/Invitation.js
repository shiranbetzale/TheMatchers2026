const {createFirestoreModel} = require('./firestoreModel');

module.exports = createFirestoreModel('invitations', {
  modelName: 'Invitation',
  uniqueFields: ['code'],
  defaults: {
    status: 'pending',
  },
});
