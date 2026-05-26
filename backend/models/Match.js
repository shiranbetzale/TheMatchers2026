const {createFirestoreModel} = require('./firestoreModel');

module.exports = createFirestoreModel('matches', {
  modelName: 'Match',
  defaults: {
    status: 'new',
    notified: false,
  },
});
