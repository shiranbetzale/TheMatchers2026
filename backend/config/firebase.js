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
    });
    return firebaseApp;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp();
  return firebaseApp;
}

function getFirestore() {
  return admin.firestore(getFirebaseApp());
}

module.exports = {
  admin,
  getFirebaseApp,
  getFirestore,
};
