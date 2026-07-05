import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {Platform} from 'react-native';
import api, {setApiAuthToken} from './api';
import {saveSession} from './session';

const AUTH_REQUEST_TIMEOUT_MS = 60000;

type LoginResponse = {
  token: string;
  user: {
    id?: string;
    _id?: string;
    fullName: string;
    phone: string;
    email?: string;
    role: 'admin' | 'matchmaker' | 'user';
  };
};

export async function loginWithPassword(phone: string, password: string) {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    {
      phone,
      password,
    },
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );

  await setApiAuthToken(response.data.token);
  await saveSession(response.data.user.role, {
    id: response.data.user.id || response.data.user._id,
    phone: response.data.user.phone,
    name: response.data.user.fullName,
    email: response.data.user.email,
  });

  return response.data.user;
}

export type CandidateVerifyResponse = {
  user: {
    id: string;
    phone: string;
    role: 'user';
    matchmakerPhone: string;
  };
  token: string;
  nextScreen: 'Wizard';
};

const toFirebasePhoneNumber = (phone: string) => {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.startsWith('972')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `+972${digits.slice(1)}`;
  }

  return `+${digits}`;
};

const assertFirebasePhoneAuthConfigured = () => {
  const appOptions = firebase.app().options as {clientId?: string};

  if (Platform.OS === 'ios' && !appOptions.clientId) {
    const error = new Error('Firebase phone auth setup is missing');
    (error as Error & {code?: string}).code = 'auth/app-not-authorized';
    throw error;
  }
};

export const sendCandidateCode = async (
  phone: string,
  matchmakerPhone: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  await api.post(
    '/auth/candidate/send-code',
    {
      phone,
      matchmakerPhone,
    },
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );

  assertFirebasePhoneAuthConfigured();

  const firebasePhone = toFirebasePhoneNumber(phone);

  console.log('Sending Firebase SMS to:', firebasePhone);

  try {
    return await auth().signInWithPhoneNumber(firebasePhone);
  } catch (error: any) {
    console.log('Firebase SMS error:', {
      code: error?.code,
      message: error?.message,
      nativeErrorMessage: error?.nativeErrorMessage,
    });

    throw error;
  }
};

export const verifyCandidateCode = async ({
  confirmation,
  phone,
  matchmakerPhone,
  code,
}: {
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  phone: string;
  matchmakerPhone: string;
  code: string;
}): Promise<CandidateVerifyResponse> => {
  const credential = await confirmation.confirm(code);

  if (!credential?.user) {
    const error = new Error('Firebase phone verification failed');
    (error as Error & {code?: string}).code = 'auth/invalid-verification-code';
    throw error;
  }

  const firebaseIdToken = await credential.user.getIdToken(true);
  const response = await api.post(
    '/auth/candidate/verify-firebase',
    {
      phone,
      matchmakerPhone,
      firebaseIdToken,
    },
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );

  await setApiAuthToken(response.data.token);

  return response.data;
};

export const verifyCandidateFallbackCode = async ({
  phone,
  matchmakerPhone,
  code,
}: {
  phone: string;
  matchmakerPhone: string;
  code: string;
}): Promise<CandidateVerifyResponse> => {
  const response = await api.post(
    '/auth/candidate/verify-code',
    {
      phone,
      matchmakerPhone,
      code,
    },
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );

  await setApiAuthToken(response.data.token);

  return response.data;
};

export const sendCandidateVoiceCode = async (
  phone: string,
  matchmakerPhone: string,
) => {
  await api.post(
    '/auth/candidate/send-voice-code',
    {phone, matchmakerPhone},
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );
};

export const verifyCandidateVoiceCode = async ({
  phone,
  matchmakerPhone,
  code,
}: {
  phone: string;
  matchmakerPhone: string;
  code: string;
}): Promise<CandidateVerifyResponse> => {
  const response = await api.post(
    '/auth/candidate/verify-voice-code',
    {phone, matchmakerPhone, code},
    {
      skipAuthToken: true,
      timeout: AUTH_REQUEST_TIMEOUT_MS,
    },
  );

  await setApiAuthToken(response.data.token);

  return response.data;
};
