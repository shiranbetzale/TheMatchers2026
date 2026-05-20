import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_TOKEN_KEY = 'authToken';

const api = axios.create({
  baseURL: 'http://192.168.x.x:5000',
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
