const storage = new Map();
let requestFulfilled;
let requestRejected;
let responseFulfilled;
let responseRejected;

const createAxiosInstance = jest.fn(() => apiInstance);

const apiInstance = {
  get: jest.fn(() => Promise.resolve()),
  interceptors: {
    request: {
      use: jest.fn((fulfilled, rejected) => {
        requestFulfilled = fulfilled;
        requestRejected = rejected;
      }),
    },
    response: {
      use: jest.fn((fulfilled, rejected) => {
        responseFulfilled = fulfilled;
        responseRejected = rejected;
      }),
    },
  },
};

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

const showGlobalLoader = jest.fn();
const hideGlobalLoader = jest.fn();
const showGlobalError = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: createAxiosInstance,
  },
  create: createAxiosInstance,
}));

jest.mock('@react-native-async-storage/async-storage', () => AsyncStorage);
jest.mock('../config/environment', () => ({
  API_BASE_URL: 'https://api.example.test',
  APP_ENV: 'test',
}));
jest.mock('../utils/LoadingManager', () => ({
  showGlobalLoader,
  hideGlobalLoader,
}));
jest.mock('../utils/MessageManager', () => ({
  showGlobalError,
}));

const apiModule = require('./api');
const api = apiModule.default;
const {API_TOKEN_KEY, clearApiAuthToken, enableGlobalApiLoader, setApiAuthToken, warmBackend} = apiModule;

describe('api service', () => {
  beforeEach(() => {
    storage.clear();
    jest.clearAllMocks();
  });

  it('configures axios with the app base URL and timeout', () => {
    expect(createAxiosInstance).toHaveBeenCalledWith({
      baseURL: 'https://api.example.test',
      timeout: 20000,
    });
    expect(api).toBe(apiInstance);
  });

  it('persists and clears the API auth token', async () => {
    await setApiAuthToken('token-123');
    expect(storage.get(API_TOKEN_KEY)).toBe('token-123');

    await clearApiAuthToken();
    expect(storage.has(API_TOKEN_KEY)).toBe(false);
  });

  it('adds the bearer token to requests unless skipAuthToken is set', async () => {
    await setApiAuthToken('token-123');

    await expect(requestFulfilled({headers: {}})).resolves.toMatchObject({
      headers: {
        Authorization: 'Bearer token-123',
      },
    });

    await expect(
      requestFulfilled({headers: {}, skipAuthToken: true}),
    ).resolves.toMatchObject({
      headers: {},
    });
  });

  it('uses a global loader around requests when enabled', async () => {
    enableGlobalApiLoader();

    const config = await requestFulfilled({headers: {}});
    expect(config.usesGlobalLoader).toBe(true);
    expect(showGlobalLoader).toHaveBeenCalledTimes(1);

    responseFulfilled({config});
    expect(hideGlobalLoader).toHaveBeenCalledTimes(1);
  });

  it('shows a debounced network error from the request error interceptor', async () => {
    await expect(
      requestRejected({code: 'ERR_NETWORK', message: 'Network Error'}),
    ).rejects.toMatchObject({code: 'ERR_NETWORK'});

    expect(showGlobalError).toHaveBeenCalledWith('noInternetConnection');
  });

  it('warms the backend without auth token and reuses an in-flight warmup call', async () => {
    const first = warmBackend();
    const second = warmBackend();

    expect(first).toBe(second);
    await first;

    expect(apiInstance.get).toHaveBeenCalledWith('/health', {
      skipLoader: true,
      skipAuthToken: true,
      timeout: 60000,
    });
  });

  it('rejects response errors from the interceptor', async () => {
    const config = {usesGlobalLoader: true};

    await expect(responseRejected({config})).rejects.toMatchObject({config});
  });
});
