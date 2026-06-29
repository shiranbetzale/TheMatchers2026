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
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BootSplash from 'react-native-bootsplash';
import DrawerNavigation from './src/components/DrawerNavigation/DrawerNavigation';
import {LanguageProvider, useLanguage} from './src/utils/LanguageProvider';
import {
  getSessionRole,
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
import api from './src/services/api';

console.log('Firebase Apps:', firebase.apps.length);
console.log('Firebase App Name:', firebase.app().name);

type Route = 'Login' | 'MainScreen' | 'OnBoarding' | 'Wizard';
const navigationRef = createNavigationContainerRef<RootStackParamList>();
setupBackgroundPushNotifications();

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState<Route | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pendingNotificationRouteRef =
    useRef<keyof RootStackParamList | null>(null);
  const {isRTL} = useLanguage();

  const navigateToNotificationTarget = useCallback(
    (routeName: keyof RootStackParamList) => {
      if (navigationRef.isReady()) {
        navigationRef.navigate(routeName as never);
        return;
      }

      pendingNotificationRouteRef.current = routeName;
    },
    [],
  );

  const flushPendingNotificationRoute = useCallback(() => {
    const pendingRoute = pendingNotificationRouteRef.current;

    if (pendingRoute && navigationRef.isReady()) {
      pendingNotificationRouteRef.current = null;
      navigationRef.navigate(pendingRoute as never);
    }
  }, []);

  const resolveInitialRoute = useCallback(async (): Promise<Route> => {
    const seen = await AsyncStorage.getItem('hasSeenOnboarding');
    const hasActiveSession = await isSessionValid();
    const sessionRole = hasActiveSession ? await getSessionRole() : null;

    if (hasActiveSession) {
      registerForPushNotifications();
    }

    if (seen !== 'true') {
      return 'OnBoarding';
    }

    if (!hasActiveSession) {
      return 'Login';
    }

    return sessionRole === 'user' ? 'Wizard' : 'MainScreen';
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setInitialRoute(await resolveInitialRoute());
      } catch (e) {
        console.warn('Error loading onboarding state:', e);
        setInitialRoute('Login');
      } finally {
        await BootSplash.hide({fade: true});
      }
    };
    init();
  }, [resolveInitialRoute]);

  useEffect(() => {
    api
      .get('/health', {skipAuthToken: true, skipLoader: true})
      .catch(error => {
        console.warn('Backend warm-up failed', error?.message || error);
      });
  }, []);

  useEffect(() => {
    return handleForegroundPushNotifications(message => {
      displayForegroundNotification(message).catch(error => {
        console.warn('Failed to display foreground notification', error);
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
      }
    });
  }, [navigateToNotificationTarget]);

  useEffect(
    () =>
      subscribeSessionChanges(() => {
        resolveInitialRoute()
          .then(nextRoute => {
            setInitialRoute(nextRoute);
            setSessionVersion(version => version + 1);
          })
          .catch(error => {
            console.warn('Failed to refresh navigation session state', error);
            setInitialRoute('Login');
            setSessionVersion(version => version + 1);
          });
      }),
    [resolveInitialRoute],
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
          key={`${isRTL ? 'rtl' : 'ltr'}-${initialRoute}-${sessionVersion}`}>
          <DrawerNavigation
            key={`${isRTL ? 'rtl' : 'ltr'}-${sessionVersion}`}
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
