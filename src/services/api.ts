import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {hideGlobalLoader, showGlobalLoader} from '../utils/LoadingManager';

export const API_TOKEN_KEY = 'authToken';

const DEV_SERVER_URL = 'https://thematchers-backend.onrender.com';
const LOADER_DELAY_MS = 350;
const REQUEST_TIMEOUT_MS = 20000;

let activeRequests = 0;
let loaderTimer: ReturnType<typeof setTimeout> | null = null;
let isLoaderVisible = false;
let cachedAuthToken: string | null | undefined;
let authTokenLoadPromise: Promise<string | null> | null = null;

const api = axios.create({
  baseURL: DEV_SERVER_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

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

  if (loaderTimer || isLoaderVisible) {
    return;
  }

  loaderTimer = setTimeout(() => {
    loaderTimer = null;

    if (activeRequests > 0) {
      isLoaderVisible = true;
      showGlobalLoader();
    }
  }, LOADER_DELAY_MS);
};

const stopLoading = () => {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests !== 0) {
    return;
  }

  if (loaderTimer) {
    clearTimeout(loaderTimer);
    loaderTimer = null;
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
  }

  export interface AxiosRequestConfig {
    skipLoader?: boolean;
    skipAuthToken?: boolean;
  }
}

api.interceptors.request.use(
  async config => {
    if (!config.skipLoader) {
      startLoading();
    }

    const token = config.skipAuthToken ? null : await loadAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    if (!error?.config?.skipLoader) {
      stopLoading();
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    if (!response.config.skipLoader) {
      stopLoading();
    }
    return response;
  },
  error => {
    if (!error?.config?.skipLoader) {
      stopLoading();
    }
    return Promise.reject(error);
  },
);

export default api;
