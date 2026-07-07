const storage = new Map();

const AsyncStorage = {
  getItem: jest.fn(key => Promise.resolve(storage.has(key) ? storage.get(key) : null)),
  setItem: jest.fn((key, value) => {
    storage.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn(key => {
    storage.delete(key);
    return Promise.resolve();
  }),
};

const clearApiAuthToken = jest.fn(() => Promise.resolve());

jest.mock('@react-native-async-storage/async-storage', () => AsyncStorage);
jest.mock('./api', () => ({
  API_TOKEN_KEY: 'authToken',
  clearApiAuthToken,
}));

const {
  clearSession,
  getSessionRole,
  getSessionUser,
  isSessionValid,
  saveSession,
  subscribeSessionChanges,
} = require('./session');

describe('session service', () => {
  const NOW = 1_700_000_000_000;
  const realDateNow = Date.now;

  beforeEach(() => {
    storage.clear();
    jest.clearAllMocks();
    Date.now = jest.fn(() => NOW);
  });

  afterAll(() => {
    Date.now = realDateNow;
  });

  it('saves a session with a 24 hour expiration and user details', async () => {
    await saveSession('matchmaker', {
      id: 'user-1',
      phone: '0501234567',
      name: 'Shiran',
      email: 'shiran@example.com',
    });

    expect(storage.get('sessionRole')).toBe('matchmaker');
    expect(storage.get('sessionPhone')).toBe('0501234567');
    expect(storage.get('sessionName')).toBe('Shiran');
    expect(storage.get('sessionEmail')).toBe('shiran@example.com');
    expect(storage.get('sessionUserId')).toBe('user-1');
    expect(Number(storage.get('sessionExpiresAt'))).toBe(NOW + 24 * 60 * 60 * 1000);
    await expect(isSessionValid()).resolves.toBe(true);
  });

  it('clears the session when the saved expiration has passed', async () => {
    storage.set('sessionExpiresAt', String(NOW - 1));
    storage.set('sessionRole', 'admin');
    storage.set('sessionPhone', '0500000000');

    await expect(isSessionValid()).resolves.toBe(false);

    expect(storage.has('sessionExpiresAt')).toBe(false);
    expect(storage.has('sessionRole')).toBe(false);
    expect(storage.has('sessionPhone')).toBe(false);
    expect(clearApiAuthToken).toHaveBeenCalledTimes(1);
  });

  it('returns null role and user when there is no valid session', async () => {
    await expect(getSessionRole()).resolves.toBeNull();
    await expect(getSessionUser()).resolves.toBeNull();
  });

  it('returns the saved user only for supported roles', async () => {
    await saveSession('admin', {
      id: 'admin-1',
      phone: '0521111111',
      name: 'Admin User',
    });

    await expect(getSessionRole()).resolves.toBe('admin');
    await expect(getSessionUser()).resolves.toEqual({
      id: 'admin-1',
      role: 'admin',
      phone: '0521111111',
      name: 'Admin User',
      email: undefined,
    });
  });

  it('notifies subscribers when the session changes and supports unsubscribe', async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSessionChanges(listener);

    await saveSession('user');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    await clearSession();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
