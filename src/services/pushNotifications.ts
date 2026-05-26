import {
  FirebaseApp,
  getApps,
  initializeApp,
} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import api from './api';

type ForegroundMessageHandler = (
  message: FirebaseMessagingTypes.RemoteMessage,
) => void;

const firebaseOptions = {
  appId:
    Platform.OS === 'ios'
      ? '1:1008658155257:ios:04c12294077154805e8428'
      : '1:1008658155257:android:08a2a338fa47f8f85e8428',
  apiKey:
    Platform.OS === 'ios'
      ? 'AIzaSyAnUY-LUWxdz9FixoMamCuwSmyaXSqbY_0'
      : 'AIzaSyDrY2pnmLo4c8zho-gUNQewR_WFeCCmbUc',
  projectId: 'thematchers-39ff5',
  storageBucket: 'thematchers-39ff5.firebasestorage.app',
  messagingSenderId: '1008658155257',
};

let firebaseAppPromise: Promise<FirebaseApp> | null = null;

const getFirebaseApp = async () => {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  if (!firebaseAppPromise) {
    firebaseAppPromise = initializeApp(firebaseOptions);
  }

  return firebaseAppPromise;
};

const getMessagingInstance = async () => getMessaging(await getFirebaseApp());

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
    const authStatus = await requestPermission(messaging);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  return requestAndroidNotificationPermission();
};

const saveDeviceToken = async (token: string) => {
  await api.post('/api/notifications/device-token', {
    token,
    platform: Platform.OS,
  });
};

export const registerForPushNotifications = async () => {
  try {
    const messaging = await getMessagingInstance();
    const hasPermission = await requestFirebasePermission(messaging);

    if (!hasPermission) {
      return undefined;
    }

    await registerDeviceForRemoteMessages(messaging);

    const token = await getToken(messaging);
    await saveDeviceToken(token);

    return token;
  } catch (error) {
    console.warn('Failed to register for push notifications', error);
    return undefined;
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
