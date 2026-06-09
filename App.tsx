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
  handleForegroundPushNotifications,
  registerForPushNotifications,
  setupBackgroundPushNotifications,
} from './src/services/pushNotifications';
import {LoadingProvider} from './src/utils/LoadingProvider';
import GlobalLoader from './src/utils/GlobalLoader';
import {MessageProvider, useMessage} from './src/utils/MessageProvider';
import firebase from '@react-native-firebase/app';

console.log('Firebase Apps:', firebase.apps.length);
console.log('Firebase App Name:', firebase.app().name);

type Route = 'Login' | 'MainScreen' | 'OnBoarding' | 'Wizard';
setupBackgroundPushNotifications();

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState<Route | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {isRTL} = useLanguage();
  const {showMessage} = useMessage();

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
      const title = message.notification?.title || '';
      const body = message.notification?.body || '';

      if (!title && !body) {
        return;
      }

      showMessage({
        type: message.data?.type === 'relationship_status' ? 'success' : 'info',
        title: title || undefined,
        message: body || title,
        autoDismissMs: 5000,
      });
    });
  }, [showMessage]);

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
    // Loader מותאם אישית עם לוגו
    return (
      <View style={styles.loaderContainer}>
        <Animated.Image
          source={require('./src/assets/images/logo.png')} // החליפי בנתיב ללוגו שלך
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
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
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default App;
