import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  CommonActions,
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BootSplash from 'react-native-bootsplash';
import DrawerNavigation from './src/components/DrawerNavigation/DrawerNavigation';
import {LanguageProvider} from './src/utils/LanguageProvider';
import {
  getSessionRole,
  getSessionUser,
  isSessionValid,
  subscribeSessionChanges,
} from './src/services/session';
import {
  displayForegroundNotification,
  handleNotificationOpenEvents,
  handleForegroundPushNotifications,
  registerForPushNotifications,
  setupBackgroundPushNotifications,
} from './src/services/pushNotifications';
import {LoadingProvider} from './src/utils/LoadingProvider';
import GlobalLoader from './src/utils/GlobalLoader';
import {MessageProvider} from './src/utils/MessageProvider';
import firebase from '@react-native-firebase/app';
import {RootStackParamList} from './src/components/MainStackNavigation/MainStackNavigation.type';
import api, {enableGlobalApiLoader} from './src/services/api';
import {mapProfileToCard} from './src/utils/generalFunction';
import {
  initializeMonitoring,
  logScreenView,
  recordAppError,
  setMonitoringUser,
} from './src/services/monitoring';

console.log('Firebase Apps:', firebase.apps.length);
console.log('Firebase App Name:', firebase.app().name);

type Route = 'Login' | 'MainScreen' | 'OnBoarding' | 'Wizard';
const navigationRef = createNavigationContainerRef<RootStackParamList>();
setupBackgroundPushNotifications();

type PendingNotificationRoute = {
  name: keyof RootStackParamList;
  params?: unknown;
};

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState<Route | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const routeNameRef = useRef<string | undefined>();
  const pendingNotificationRouteRef =
    useRef<PendingNotificationRoute | null>(null);

  const setupMonitoringUser = useCallback(async () => {
    const [role, user] = await Promise.all([getSessionRole(), getSessionUser()]);

    await setMonitoringUser({
      id: user?.id,
      phone: user?.phone,
      role: role || undefined,
    });
  }, []);

  const navigateToNotificationTarget = useCallback(
    (routeName: keyof RootStackParamList, params?: unknown) => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.navigate({
            name: routeName,
            params: params as object | undefined,
          }),
        );
        return;
      }

      pendingNotificationRouteRef.current = {name: routeName, params};
    },
    [],
  );

  const flushPendingNotificationRoute = useCallback(() => {
    const pendingRoute = pendingNotificationRouteRef.current;

    routeNameRef.current = navigationRef.getCurrentRoute()?.name;
    logScreenView(routeNameRef.current);

    if (pendingRoute && navigationRef.isReady()) {
      pendingNotificationRouteRef.current = null;
      navigationRef.dispatch(
        CommonActions.navigate({
          name: pendingRoute.name,
          params: pendingRoute.params as object | undefined,
        }),
      );
    }
  }, []);

  const openCreatedProfile = useCallback(
    async (profileId: string) => {
      try {
        const response = await api.get('/api/profiles', {skipLoader: true});
        const profiles = Array.isArray(response.data?.profiles)
          ? response.data.profiles
          : [];
        const profile = profiles.find(
          (item: any) => String(item._id || item.id || '') === profileId,
        );

        if (!profile) {
          navigateToNotificationTarget('AllCardsScreen');
          return;
        }

        navigateToNotificationTarget('MatchCardsScreen', {
          card: mapProfileToCard(profile),
        });
      } catch (error) {
        console.warn('Failed to open profile-created notification', error);
        navigateToNotificationTarget('AllCardsScreen');
      }
    },
    [navigateToNotificationTarget],
  );

  const resolveInitialRoute = useCallback(async (): Promise<Route> => {
    const seen = await AsyncStorage.getItem('hasSeenOnboarding');
    const hasActiveSession = await isSessionValid();
    const sessionRole = hasActiveSession ? await getSessionRole() : null;

    if (hasActiveSession) {
      registerForPushNotifications();
      setupMonitoringUser();
    }

    if (seen !== 'true') {
      return 'OnBoarding';
    }

    if (!hasActiveSession) {
      return 'Login';
    }

    return sessionRole === 'user' ? 'Wizard' : 'MainScreen';
  }, [setupMonitoringUser]);

  useEffect(() => {
    initializeMonitoring();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setInitialRoute(await resolveInitialRoute());
      } catch (e) {
        console.warn('Error loading onboarding state:', e);
        recordAppError(e, 'Error loading onboarding state');
        setInitialRoute('Login');
      } finally {
        await BootSplash.hide({fade: true});
        setTimeout(enableGlobalApiLoader, 500);
      }
    };
    init();
  }, [resolveInitialRoute]);

  useEffect(() => {
    api
      .get('/health', {skipAuthToken: true, skipLoader: true})
      .catch(error => {
        console.warn('Backend warm-up failed', error?.message || error);
        recordAppError(error, 'Backend warm-up failed');
      });
  }, []);

  useEffect(() => {
    return handleForegroundPushNotifications(message => {
      displayForegroundNotification(message).catch(error => {
        console.warn('Failed to display foreground notification', error);
        recordAppError(error, 'Failed to display foreground notification');
      });
    });
  }, []);

  useEffect(() => {
    return handleNotificationOpenEvents(data => {
      if (
        data.targetScreen === 'ArchiveScreen' ||
        data.type === 'relationship_status'
      ) {
        navigateToNotificationTarget('ArchiveScreen');
        return;
      }

      if (
        data.targetScreen === 'ContactRequestsScreen' ||
        data.type === 'contact_request_created'
      ) {
        navigateToNotificationTarget('ContactRequestsScreen');
        return;
      }

      if (
        data.targetScreen === 'MatchCardsScreen' ||
        data.type === 'profile_created'
      ) {
        openCreatedProfile(data.profileId || '');
      }
    });
  }, [navigateToNotificationTarget, openCreatedProfile]);

  useEffect(
    () =>
      subscribeSessionChanges(() => {
        setupMonitoringUser();
        resolveInitialRoute()
          .then(nextRoute => {
            setInitialRoute(nextRoute);
            setSessionVersion(version => version + 1);
          })
          .catch(error => {
            console.warn('Failed to refresh navigation session state', error);
            recordAppError(error, 'Failed to refresh navigation session state');
            setInitialRoute('Login');
            setSessionVersion(version => version + 1);
          });
      }),
    [resolveInitialRoute, setupMonitoringUser],
  );

  useEffect(() => {
    if (initialRoute !== null) {
      // Fade-in אפקט כאשר המסך מוכן לרינדור
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, initialRoute]);

  if (initialRoute === null) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer
          ref={navigationRef}
          onReady={flushPendingNotificationRoute}
          onStateChange={() => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.getCurrentRoute()?.name;

            if (currentRouteName && previousRouteName !== currentRouteName) {
              routeNameRef.current = currentRouteName;
              logScreenView(currentRouteName);
            }
          }}
          key={`${isRTL ? 'rtl' : 'ltr'}-${initialRoute}-${sessionVersion}`}>
          <DrawerNavigation
            key={`${sessionVersion}`}
            initialRoute={initialRoute}
          />
        </NavigationContainer>
      </SafeAreaView>
    </Animated.View>
  );
};

const App = () => (
  <LanguageProvider>
    <MessageProvider>
      <LoadingProvider>
        <AppContent />
        <GlobalLoader />
      </LoadingProvider>
    </MessageProvider>
  </LanguageProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
