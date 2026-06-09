const admin = require('firebase-admin');

let firebaseApp;

function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (admin.apps.length) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
      ),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        'thematchers-39ff5.firebasestorage.app',
    });
    return firebaseApp;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET ||
        'thematchers-39ff5.firebasestorage.app',
    });
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp({
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      'thematchers-39ff5.firebasestorage.app',
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
