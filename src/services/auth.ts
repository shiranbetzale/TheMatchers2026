import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {Platform} from 'react-native';
import api, {API_TOKEN_KEY} from './api';
import {saveSession} from './session';

type LoginResponse = {
  token: string;
  user: {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    role: 'admin' | 'matchmaker' | 'user';
  };
};

export async function loginWithPassword(phone: string, password: string) {
  const response = await api.post<LoginResponse>('/auth/login', {
    phone,
    password,
  });

  await AsyncStorage.setItem(API_TOKEN_KEY, response.data.token);
  await saveSession(response.data.user.role, {
    id: response.data.user._id,
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
  await api.post('/auth/candidate/send-code', {
    phone,
    matchmakerPhone,
  });

  assertFirebasePhoneAuthConfigured();

  return auth().signInWithPhoneNumber(toFirebasePhoneNumber(phone));
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
  const response = await api.post('/auth/candidate/verify-firebase', {
    phone,
    matchmakerPhone,
    firebaseIdToken,
  });

  await AsyncStorage.setItem(API_TOKEN_KEY, response.data.token);

  return response.data;
};
