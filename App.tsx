import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import DrawerNavigation from './src/components/DrawerNavigation/DrawerNavigation';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {LanguageProvider} from './src/utils/LanguageProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BootSplash from 'react-native-bootsplash';

const App = () => {
  const [initialRoute, setInitialRoute] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setInitialRoute(seen === 'true' ? 'Login' : 'OnBoarding');
      BootSplash.hide({fade: true});
    };
    init();
  }, []);

  if (initialRoute === null) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LanguageProvider>
        <NavigationContainer>
          <DrawerNavigation initialRoute={initialRoute} />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
