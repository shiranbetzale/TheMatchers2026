import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
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
  handleForegroundPushNotifications,
  registerForPushNotifications,
  setupBackgroundPushNotifications,
} from './src/services/pushNotifications';
import {LoadingProvider} from './src/utils/LoadingProvider';
import GlobalLoader from './src/utils/GlobalLoader';
import {MessageProvider} from './src/utils/MessageProvider';
import firebase from '@react-native-firebase/app';

console.log('Firebase Apps:', firebase.apps.length);
console.log('Firebase App Name:', firebase.app().name);

type Route = 'Login' | 'MainScreen' | 'OnBoarding' | 'Wizard';
setupBackgroundPushNotifications();

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState<Route | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;
  const {isRTL} = useLanguage();

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
        BootSplash.hide({fade: true});
      }
    };
    init();
  }, [resolveInitialRoute]);

  useEffect(() => {
    return handleForegroundPushNotifications(message => {
      displayForegroundNotification(message).catch(error => {
        console.warn('Failed to display foreground notification', error);
      });
    });
  }, []);

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

  useEffect(() => {
    if (initialRoute !== null) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(loaderAnim, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(loaderAnim, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [initialRoute, loaderAnim]);

  if (initialRoute === null) {
    const iconScale = loaderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.96, 1.05],
    });
    const haloScale = loaderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 1.12],
    });
    const haloOpacity = loaderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.34, 0.08],
    });

    return (
      <View style={styles.loaderContainer}>
        <Animated.Image
          source={require('./assets/app-icon/app-icon-1024.png')}
          style={[
            styles.logoGlow,
            {
              opacity: haloOpacity,
              transform: [{scale: haloScale}],
            },
          ]}
          resizeMode="cover"
        />
        <Animated.Image
          source={require('./assets/app-icon/app-icon-1024.png')}
          style={[
            styles.logo,
            {
              transform: [{scale: iconScale}],
            },
          ]}
          resizeMode="cover"
        />
      </View>
    );
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFCF7',
  },
  logo: {
    width: 112,
    height: 112,
    borderRadius: 30,
    shadowColor: 'rgba(6, 26, 54, 0.22)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  logoGlow: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 30,
  },
});

export default App;
