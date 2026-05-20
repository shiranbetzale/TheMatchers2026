import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { API_TOKEN_KEY } from './api';

type LoginResponse = {
  token: string;
  user: {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    role: 'admin' | 'matchmaker' | 'user';
  };
};

export async function loginWithPassword(phone: string, password: string) {
  const response = await api.post<LoginResponse>('/auth/login', {
    phone,
    password,
  });

  await AsyncStorage.setItem(API_TOKEN_KEY, response.data.token);

  return response.data.user;
}
