import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, View, Animated } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BootSplash from 'react-native-bootsplash';
import DrawerNavigation from './src/components/DrawerNavigation/DrawerNavigation';
import { LanguageProvider, useLanguage } from './src/utils/LanguageProvider';
import {isSessionValid} from './src/services/session';
import {
  handleForegroundPushNotifications,
  registerForPushNotifications,
} from './src/services/pushNotifications';

type Route = 'Login' | 'MainScreen' | 'OnBoarding';

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState<Route | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {isRTL} = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        const hasActiveSession = await isSessionValid();

        if (hasActiveSession) {
          registerForPushNotifications();
        }

        if (seen !== 'true') {
          setInitialRoute('OnBoarding');
          return;
        }

        setInitialRoute(hasActiveSession ? 'MainScreen' : 'Login');
      } catch (e) {
        console.warn('Error loading onboarding state:', e);
        setInitialRoute('Login');
      } finally {
        BootSplash.hide({ fade: true });
      }
    };
    init();
  }, []);

  useEffect(() => {
    return handleForegroundPushNotifications(message => {
      const title = message.notification?.title || 'התראה חדשה';
      const body = message.notification?.body || '';

      Alert.alert(title, body);
    });
  }, []);

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
      ]}
    >
      <SafeAreaView
        style={styles.safeArea}
      >
        <NavigationContainer>
          <DrawerNavigation key={isRTL ? 'rtl' : 'ltr'} initialRoute={initialRoute} />
        </NavigationContainer>
      </SafeAreaView>
    </Animated.View>
  );
};

const App = () => (
  <LanguageProvider>
    <AppContent />
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
