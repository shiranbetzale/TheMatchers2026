import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {hideGlobalLoader, showGlobalLoader} from '../utils/LoadingManager';

export const API_TOKEN_KEY = 'authToken';

const DEV_SERVER_URL = 'https://thematchers-backend.onrender.com';

let activeRequests = 0;

const api = axios.create({
  baseURL: DEV_SERVER_URL,
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
