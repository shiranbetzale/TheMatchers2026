import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';

export const API_TOKEN_KEY = 'authToken';

const api = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:4000'
      : 'http://localhost:4000',
  timeout: 15000,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(API_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
