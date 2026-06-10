import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import api from './api';

type ForegroundMessageHandler = (
  message: FirebaseMessagingTypes.RemoteMessage,
) => void;
export type PushRegistrationResult =
  | {ok: true; token: string}
  | {
      ok: false;
      reason: 'permission_denied' | 'token_missing' | 'unknown_error';
      details?: string;
    };

const getMessagingInstance = async () => getMessaging(getApp());

export const setupBackgroundPushNotifications = () => {
  const messaging = getMessaging(getApp());

  setBackgroundMessageHandler(messaging, async message => {
    console.log('Background push received:', message);
  });
};

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const requestFirebasePermission = async (
  messaging: FirebaseMessagingTypes.Module,
) => {
  if (Platform.OS === 'ios') {
    const currentStatus = await hasPermission(messaging);
    console.log('Current iOS notification permission status:', currentStatus);

    if (currentStatus === AuthorizationStatus.DENIED) {
      console.warn(
        'iOS notification permission was denied. Enable it from Settings > Notifications.',
      );
      return false;
    }

    const authStatus = await requestPermission(messaging);
    console.log('Requested iOS notification permission status:', authStatus);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  return requestAndroidNotificationPermission();
};

const saveDeviceToken = async (token: string) => {
  try {
    await api.post('/api/notifications/device-token', {
      token,
      platform: Platform.OS,
    }, {
      skipLoader: true,
    });
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = error?.message;
    console.warn('Failed saving device token to backend', {status, data, message});
    throw error;
  }
};

export const registerForPushNotifications =
  async (): Promise<PushRegistrationResult> => {
  try {
    console.log('Push registration started');
    const messaging = await getMessagingInstance();
    const hasPermission = await requestFirebasePermission(messaging);

    if (!hasPermission) {
      console.warn('Push permission not granted');
      return {ok: false, reason: 'permission_denied'};
    }

    await registerDeviceForRemoteMessages(messaging);
    console.log('Registered device for remote messages');

    const token = await getToken(messaging);
    console.log('FCM token received:', Boolean(token));
    if (!token) {
      console.warn('FCM token is empty');
      return {ok: false, reason: 'token_missing'};
    }
    await saveDeviceToken(token);
    console.log('FCM token saved on backend');

    return {ok: true, token};
  } catch (error: any) {
    const details = [error?.code, error?.message].filter(Boolean).join(' | ');
    console.warn('Failed to register for push notifications', {
      message: error?.message,
      code: error?.code,
      nativeErrorCode: error?.nativeErrorCode,
    });
    return {ok: false, reason: 'unknown_error', details};
  }
};

export const handleForegroundPushNotifications = (
  handler?: ForegroundMessageHandler,
) => {
  let unsubscribeMessage: (() => void) | undefined;
  let unsubscribeTokenRefresh: (() => void) | undefined;
  let isActive = true;

  getMessagingInstance()
    .then(messaging => {
      if (!isActive) {
        return;
      }

      unsubscribeMessage = onMessage(messaging, message => {
        handler?.(message);
      });

      unsubscribeTokenRefresh = onTokenRefresh(messaging, token => {
        saveDeviceToken(token).catch(error => {
          console.warn('Failed to update push notification token', error);
        });
      });
    })
    .catch(error => {
      console.warn('Failed to listen for push notifications', error);
    });

  return () => {
    isActive = false;
    unsubscribeMessage?.();
    unsubscribeTokenRefresh?.();
  };
};
