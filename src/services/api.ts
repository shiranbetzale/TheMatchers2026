import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {hideGlobalLoader, showGlobalLoader} from '../utils/LoadingManager';

export const API_TOKEN_KEY = 'authToken';

const DEV_SERVER_URL = 'http://192.168.223.147:4000';
const LOCALHOST_URL = 'http://localhost:4000';
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:4000';

let activeRequests = 0;

const api = axios.create({
  baseURL: (() => {
    if (Platform.OS === 'android') {
      return DeviceInfo.isEmulatorSync()
        ? ANDROID_EMULATOR_URL
        : DEV_SERVER_URL;
    }

    if (Platform.OS === 'ios') {
      return DeviceInfo.isEmulatorSync() ? LOCALHOST_URL : DEV_SERVER_URL;
    }

    return DEV_SERVER_URL;
  })(),
  timeout: 15000,
});

const startLoading = () => {
  activeRequests += 1;
  showGlobalLoader();
};

const stopLoading = () => {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests === 0) {
    hideGlobalLoader();
  }
};

api.interceptors.request.use(
  async config => {
    startLoading();

    const token = await AsyncStorage.getItem(API_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    stopLoading();
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    stopLoading();
    return response;
  },
  error => {
    stopLoading();
    return Promise.reject(error);
  },
);

export default api;
