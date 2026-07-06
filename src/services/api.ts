import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {API_BASE_URL, APP_ENV} from '../config/environment';
import {hideGlobalLoader, showGlobalLoader} from '../utils/LoadingManager';
import {showGlobalError} from '../utils/MessageManager';

export const API_TOKEN_KEY = 'authToken';

const REQUEST_TIMEOUT_MS = 20000;
const BACKEND_WARMUP_TIMEOUT_MS = 60000;

let activeRequests = 0;
let isLoaderVisible = false;
let isGlobalLoaderEnabled = false;
let cachedAuthToken: string | null | undefined;
let authTokenLoadPromise: Promise<string | null> | null = null;
let backendWarmupPromise: Promise<void> | null = null;
let lastNetworkErrorAt = 0;

const NETWORK_ERROR_DEBOUNCE_MS = 3000;

const isNetworkError = (error: any) =>
  !error?.response &&
  (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error');

const showNetworkError = () => {
  const now = Date.now();

  if (now - lastNetworkErrorAt < NETWORK_ERROR_DEBOUNCE_MS) {
    return;
  }

  lastNetworkErrorAt = now;
  showGlobalError('noInternetConnection');
};

if (__DEV__) {
  console.log('API environment:', APP_ENV, API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

export const enableGlobalApiLoader = () => {
  isGlobalLoaderEnabled = true;

  if (activeRequests > 0 && !isLoaderVisible) {
    isLoaderVisible = true;
    showGlobalLoader();
  }
};

export const warmBackend = () => {
  if (!backendWarmupPromise) {
    backendWarmupPromise = api
      .get('/health', {
        skipLoader: true,
        skipAuthToken: true,
        timeout: BACKEND_WARMUP_TIMEOUT_MS,
      })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        backendWarmupPromise = null;
      });
  }

  return backendWarmupPromise;
};

const loadAuthToken = async () => {
  if (cachedAuthToken !== undefined) {
    return cachedAuthToken;
  }

  if (!authTokenLoadPromise) {
    authTokenLoadPromise = AsyncStorage.getItem(API_TOKEN_KEY).then(token => {
      cachedAuthToken = token;
      authTokenLoadPromise = null;
      return token;
    });
  }

  return authTokenLoadPromise;
};

export const setApiAuthToken = async (token: string) => {
  cachedAuthToken = token;
  authTokenLoadPromise = null;
  await AsyncStorage.setItem(API_TOKEN_KEY, token);
};

export const clearApiAuthToken = async () => {
  cachedAuthToken = null;
  authTokenLoadPromise = null;
  await AsyncStorage.removeItem(API_TOKEN_KEY);
};

const startLoading = () => {
  activeRequests += 1;

  if (!isGlobalLoaderEnabled || isLoaderVisible) {
    return true;
  }

  isLoaderVisible = true;
  showGlobalLoader();
  return true;
};

const stopLoading = () => {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests !== 0) {
    return;
  }

  if (isLoaderVisible) {
    isLoaderVisible = false;
    hideGlobalLoader();
  }
};

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipLoader?: boolean;
    skipAuthToken?: boolean;
    usesGlobalLoader?: boolean;
  }

  export interface AxiosRequestConfig {
    skipLoader?: boolean;
    skipAuthToken?: boolean;
  }
}

api.interceptors.request.use(
  async config => {
    if (!config.skipLoader) {
      config.usesGlobalLoader = startLoading();
    }

    const token = config.skipAuthToken ? null : await loadAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    if (error?.config?.usesGlobalLoader) {
      stopLoading();
    }
    if (isNetworkError(error)) {
      showNetworkError();
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    if (response.config.usesGlobalLoader) {
      stopLoading();
    }
    return response;
  },
  error => {
    if (error?.config?.usesGlobalLoader) {
      stopLoading();
    }
    return Promise.reject(error);
  },
);

export default api;
