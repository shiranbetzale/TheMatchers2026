import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_TOKEN_KEY} from './api';

const SESSION_EXPIRES_AT_KEY = 'sessionExpiresAt';
const SESSION_ROLE_KEY = 'sessionRole';
const SESSION_PHONE_KEY = 'sessionPhone';
const SESSION_NAME_KEY = 'sessionName';
const SESSION_EMAIL_KEY = 'sessionEmail';
const SESSION_USER_ID_KEY = 'sessionUserId';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const SESSION_KEYS = [
  SESSION_EXPIRES_AT_KEY,
  SESSION_ROLE_KEY,
  SESSION_PHONE_KEY,
  SESSION_NAME_KEY,
  SESSION_EMAIL_KEY,
  SESSION_USER_ID_KEY,
  API_TOKEN_KEY,
];

export type UserRole = 'admin' | 'matchmaker' | 'user';
export type SessionUser = {
  id?: string;
  role: UserRole;
  phone: string;
  name?: string;
  email?: string;
};

export const saveSession = async (
  role: UserRole = 'user',
  user?: {id?: string; phone?: string; name?: string; email?: string},
) => {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  await AsyncStorage.setItem(SESSION_EXPIRES_AT_KEY, String(expiresAt));
  await AsyncStorage.setItem(SESSION_ROLE_KEY, role);

  if (user?.id) {
    await AsyncStorage.setItem(SESSION_USER_ID_KEY, user.id);
  }

  if (user?.phone) {
    await AsyncStorage.setItem(SESSION_PHONE_KEY, user.phone);
  }

  if (user?.name) {
    await AsyncStorage.setItem(SESSION_NAME_KEY, user.name);
  }

  if (user?.email) {
    await AsyncStorage.setItem(SESSION_EMAIL_KEY, user.email);
  }
};

export const clearSession = async () => {
  await Promise.all(SESSION_KEYS.map(key => AsyncStorage.removeItem(key)));
};

export const isSessionValid = async () => {
  const expiresAt = await AsyncStorage.getItem(SESSION_EXPIRES_AT_KEY);

  if (!expiresAt) {
    return false;
  }

  const expiresAtTime = Number(expiresAt);

  if (!Number.isFinite(expiresAtTime) || expiresAtTime <= Date.now()) {
    await clearSession();
    return false;
  }

  return true;
};

export const getSessionRole = async (): Promise<UserRole | null> => {
  if (!(await isSessionValid())) {
    return null;
  }

  const role = await AsyncStorage.getItem(SESSION_ROLE_KEY);

  if (role === 'admin' || role === 'matchmaker' || role === 'user') {
    return role;
  }

  return null;
};

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const role = await getSessionRole();

  if (!role) {
    return null;
  }

  const [id, phone, name, email] = await Promise.all([
    AsyncStorage.getItem(SESSION_USER_ID_KEY),
    AsyncStorage.getItem(SESSION_PHONE_KEY),
    AsyncStorage.getItem(SESSION_NAME_KEY),
    AsyncStorage.getItem(SESSION_EMAIL_KEY),
  ]);

  return {
    id: id || undefined,
    role,
    phone: phone || '',
    name: name || undefined,
    email: email || undefined,
  };
};
