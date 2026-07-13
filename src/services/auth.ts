import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {Platform} from 'react-native';
import api, {setApiAuthToken} from './api';
import {saveSession} from './session';

const AUTH_REQUEST_TIMEOUT_MS = 60000;

export const E2E_MATCHMAKER_PHONE = '0500000001';
export const E2E_MATCHMAKER_PASSWORD = 'e2e-matchmaker';
export const E2E_CANDIDATE_PHONE = '0500000002';
export const E2E_CANDIDATE_CODE = '123456';

let lastCandidateSmsPhone = '';

const isE2EMatchmaker = (phone: string, password: string) =>
  __DEV__ &&
  phone === E2E_MATCHMAKER_PHONE &&
  password === E2E_MATCHMAKER_PASSWORD;

const isE2ECandidate = (phone: string, matchmakerPhone: string) =>
  __DEV__ &&
  phone === E2E_CANDIDATE_PHONE &&
  matchmakerPhone === E2E_MATCHMAKER_PHONE;

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
  if (isE2EMatchmaker(phone, password)) {
    const user: LoginResponse['user'] = {
      id: 'e2e-matchmaker',
      fullName: 'E2E Matchmaker',
      phone,
      email: 'e2e-matchmaker@example.invalid',
      role: 'matchmaker',
    };

    await setApiAuthToken('e2e-debug-token');
    await saveSession(user.role, {
      id: user.id,
      phone: user.phone,
      name: user.fullName,
      email: user.email,
    });

    return user;
  }

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

const createE2ECandidateResponse = (
  phone: string,
  matchmakerPhone: string,
): CandidateVerifyResponse => ({
  user: {
    id: 'e2e-candidate',
    phone,
    role: 'user',
    matchmakerPhone,
  },
  token: 'e2e-candidate-debug-token',
  nextScreen: 'Wizard',
});

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
  forceResend = false,
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  if (isE2ECandidate(phone, matchmakerPhone)) {
    return {
      confirm: async (code: string) => {
        if (code !== E2E_CANDIDATE_CODE) {
          const error = new Error('Invalid E2E verification code');
          (error as Error & {code?: string}).code =
            'auth/invalid-verification-code';
          throw error;
        }

        return {
          user: {
            getIdToken: async () => 'e2e-firebase-id-token',
          },
        } as FirebaseAuthTypes.UserCredential;
      },
      verificationId: 'e2e-verification-id',
    } as FirebaseAuthTypes.ConfirmationResult;
  }

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
  const shouldForceResend = forceResend || lastCandidateSmsPhone === firebasePhone;

  console.log('Sending Firebase SMS to:', firebasePhone, {
    forceResend: shouldForceResend,
  });

  try {
    const confirmation = await auth().signInWithPhoneNumber(
      firebasePhone,
      shouldForceResend,
    );
    lastCandidateSmsPhone = firebasePhone;
    return confirmation;
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

  if (isE2ECandidate(phone, matchmakerPhone)) {
    const response = createE2ECandidateResponse(phone, matchmakerPhone);
    await setApiAuthToken(response.token);
    return response;
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
  if (isE2ECandidate(phone, matchmakerPhone)) {
    if (code !== E2E_CANDIDATE_CODE) {
      const error = new Error('invalid candidate code') as Error & {
        response?: {status: number};
      };
      error.response = {status: 401};
      throw error;
    }

    const result = createE2ECandidateResponse(phone, matchmakerPhone);
    await setApiAuthToken(result.token);
    return result;
  }

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
  if (isE2ECandidate(phone, matchmakerPhone)) {
    return;
  }

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
  if (isE2ECandidate(phone, matchmakerPhone)) {
    if (code !== E2E_CANDIDATE_CODE) {
      const error = new Error('invalid candidate code') as Error & {
        response?: {status: number};
      };
      error.response = {status: 401};
      throw error;
    }

    const result = createE2ECandidateResponse(phone, matchmakerPhone);
    await setApiAuthToken(result.token);
    return result;
  }

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
