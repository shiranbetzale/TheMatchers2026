const {getFirestore} = require('./firebase');

async function connectToDatabase() {
  const db = getFirestore();
  console.log('Firebase Firestore initialized');
  return db;
}

module.exports = {connectToDatabase};
