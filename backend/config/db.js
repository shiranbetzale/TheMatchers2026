const {getFirestore} = require('./firebase');

async function connectToDatabase() {
  const db = getFirestore();
  await db.collection('_health').doc('backend').set(
    {
      lastConnectedAt: new Date(),
    },
    {merge: true},
  );
  console.log('Connected to Firebase Firestore');
  return db;
}

module.exports = {connectToDatabase};
