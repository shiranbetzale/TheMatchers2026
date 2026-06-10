import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {hideGlobalLoader, showGlobalLoader} from '../utils/LoadingManager';

export const API_TOKEN_KEY = 'authToken';

const DEV_SERVER_URL = 'https://thematchers-backend.onrender.com';
const LOADER_DELAY_MS = 350;

let activeRequests = 0;
let loaderTimer: ReturnType<typeof setTimeout> | null = null;
let isLoaderVisible = false;

const api = axios.create({
  baseURL: DEV_SERVER_URL,
});

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
  }

  export interface AxiosRequestConfig {
    skipLoader?: boolean;
  }
}

api.interceptors.request.use(
  async config => {
    if (!config.skipLoader) {
      startLoading();
    }

    const token = await AsyncStorage.getItem(API_TOKEN_KEY);

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
