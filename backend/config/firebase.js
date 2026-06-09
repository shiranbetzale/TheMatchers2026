const admin = require('firebase-admin');

let firebaseApp;

const DEFAULT_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || 'thematchers-39ff5.appspot.com';

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  if (admin.apps.length) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
      ),
      storageBucket: DEFAULT_STORAGE_BUCKET,
    });
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp({
    storageBucket: DEFAULT_STORAGE_BUCKET,
  });

  return firebaseApp;
}

function getFirestore() {
  return admin.firestore(getFirebaseApp());
}

function getStorageBucket() {
  return admin.storage(getFirebaseApp()).bucket();
}

module.exports = {
  admin,
  getFirebaseApp,
  getFirestore,
  getStorageBucket,
};
