const admin = require('firebase-admin');

let firebaseApp;

const DEFAULT_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || 'thematchers-39ff5.firebasestorage.app';

function parseServiceAccountJson(value, sourceName) {
  try {
    return JSON.parse(value);
  } catch (error) {
    const parseError = new Error(
      `Invalid ${sourceName}. Check that the value is the full Firebase service account JSON.`,
    );
    parseError.cause = error;
    parseError.code = 'invalid_firebase_service_account';
    throw parseError;
  }
}

function getServiceAccountCredential() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountJsonBase64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  if (!serviceAccountJson && !serviceAccountJsonBase64) {
    return null;
  }

  if (serviceAccountJsonBase64) {
    const decodedServiceAccountJson = Buffer.from(
      serviceAccountJsonBase64,
      'base64',
    ).toString('utf8');

    return admin.credential.cert(
      parseServiceAccountJson(
        decodedServiceAccountJson,
        'FIREBASE_SERVICE_ACCOUNT_JSON_BASE64',
      ),
    );
  }

  return admin.credential.cert(
    parseServiceAccountJson(
      serviceAccountJson,
      'FIREBASE_SERVICE_ACCOUNT_JSON',
    ),
  );
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
