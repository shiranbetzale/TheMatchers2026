import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Modal, StyleSheet, View} from 'react-native';
import {useLoading} from './LoadingProvider';

const GlobalLoader = () => {
  const {isLoading} = useLoading();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading, pulseAnim]);

  const iconScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.06],
  });

  const haloScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });

  const haloOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderCard}>
          <Animated.View
            style={[
              styles.halo,
              {
                opacity: haloOpacity,
                transform: [{scale: haloScale}],
              },
            ]}
          />
          <Animated.Image
            source={require('../../assets/app-icon/app-icon-1024.png')}
            style={[
              styles.icon,
              {
                transform: [{scale: iconScale}],
              },
            ]}
            resizeMode="cover"
          />
          <View style={styles.goldLine} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 26, 54, 0.42)',
  },
  loaderCard: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 69, 0.42)',
    backgroundColor: '#FFFCF7',
    shadowColor: 'rgba(6, 26, 54, 0.24)',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 12,
  },
  halo: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: '#C59B45',
  },
  icon: {
    width: 82,
    height: 82,
    borderRadius: 22,
  },
  goldLine: {
    width: 34,
    height: 3,
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: '#C59B45',
  },
});

export default GlobalLoader;
