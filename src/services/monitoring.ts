import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import {APP_ENV} from '../config/environment';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export const initializeMonitoring = async () => {
  try {
    await analytics().setAnalyticsCollectionEnabled(true);
    await crashlytics().setCrashlyticsCollectionEnabled(true);
    await crashlytics().setAttribute('app_environment', APP_ENV);
  } catch (error) {
    if (__DEV__) {
      console.warn('Monitoring initialization failed', error);
    }
  }
};

export const setMonitoringUser = async (user?: {
  id?: string;
  phone?: string;
  role?: string;
}) => {
  try {
    const userId = String(user?.id || user?.phone || '').trim();

    if (userId) {
      await Promise.all([
        analytics().setUserId(userId),
        crashlytics().setUserId(userId),
      ]);
    }

    if (user?.role) {
      await analytics().setUserProperty('role', user.role);
      await crashlytics().setAttribute('role', user.role);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('Monitoring user setup failed', error);
    }
  }
};

export const logScreenView = async (screenName?: string) => {
  const cleanScreenName = String(screenName || '').trim();

  if (!cleanScreenName) {
    return;
  }

  try {
    await analytics().logScreenView({
      screen_name: cleanScreenName,
      screen_class: cleanScreenName,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Screen analytics failed', error);
    }
  }
};

export const logAppEvent = async (
  eventName: string,
  params: AnalyticsParams = {},
) => {
  try {
    await analytics().logEvent(eventName, {
      app_environment: APP_ENV,
      ...params,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Analytics event failed', eventName, error);
    }
  }
};

export const recordAppError = (error: unknown, context?: string) => {
  try {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error || 'Unknown error'));

    if (context) {
      crashlytics().log(context);
    }

    crashlytics().recordError(normalizedError);
  } catch (recordError) {
    if (__DEV__) {
      console.warn('Crashlytics record failed', recordError);
    }
  }
};
