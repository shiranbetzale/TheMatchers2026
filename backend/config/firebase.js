const admin = require('firebase-admin');

let firebaseApp;

const DEFAULT_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || 'thematchers-39ff5.appspot.com';

function getServiceAccountCredential() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    return null;
  }

  try {
    return admin.credential.cert(JSON.parse(serviceAccountJson));
  } catch (error) {
    const parseError = new Error(
      'Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Check that the value is the full Firebase service account JSON.',
    );
    parseError.cause = error;
    parseError.code = 'invalid_firebase_service_account';
    throw parseError;
  }
}

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  if (admin.apps.length) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  const credential = getServiceAccountCredential();

  if (credential) {
    firebaseApp = admin.initializeApp({
      credential,
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
