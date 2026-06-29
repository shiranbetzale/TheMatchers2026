import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Modal, StyleSheet, View} from 'react-native';
import {useLoading} from './LoadingProvider';

export const GlobalLoaderVisual = ({active = true}: {active?: boolean}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      pulseAnim.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [active, pulseAnim]);

  const iconScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.06],
  });

  const haloScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.12],
  });

  const haloOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.32, 0.08],
  });

  return (
    <>
      <Animated.Image
        source={require('../../assets/app-icon/app-icon-1024.png')}
        style={[
          styles.iconGlow,
          {
            opacity: haloOpacity,
            transform: [{scale: haloScale}],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require('../../assets/app-icon/app-icon-1024.png')}
        style={[styles.icon, {transform: [{scale: iconScale}]}]}
        resizeMode="contain"
      />
    </>
  );
};

const GlobalLoader = () => {
  const {isLoading} = useLoading();

  return (
    <Modal
      transparent
      visible={isLoading}
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.overlay}>
        <GlobalLoaderVisual active={isLoading} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 26, 54, 0.28)',
  },
  icon: {
    width: 86,
    height: 86,
    borderRadius: 24,
    shadowColor: 'rgba(6, 26, 54, 0.28)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 10,
  },
  iconGlow: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 24,
  },
});

export default GlobalLoader;
