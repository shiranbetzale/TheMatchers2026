import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_EXPIRES_AT_KEY = 'sessionExpiresAt';
const SESSION_ROLE_KEY = 'sessionRole';
const SESSION_DURATION_MS = 10 * 60 * 1000;

export type UserRole = 'admin' | 'matchmaker' | 'user';

export const saveSession = async (role: UserRole = 'user') => {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  await AsyncStorage.setItem(SESSION_EXPIRES_AT_KEY, String(expiresAt));
  await AsyncStorage.setItem(SESSION_ROLE_KEY, role);
};

export const isSessionValid = async () => {
  const expiresAt = await AsyncStorage.getItem(SESSION_EXPIRES_AT_KEY);

  if (!expiresAt) {
    return false;
  }

  const expiresAtTime = Number(expiresAt);

  if (!Number.isFinite(expiresAtTime) || expiresAtTime <= Date.now()) {
    await AsyncStorage.removeItem(SESSION_EXPIRES_AT_KEY);
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
