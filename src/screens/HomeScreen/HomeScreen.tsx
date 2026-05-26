import React, {useEffect, useRef} from 'react';
import {Animated, SafeAreaView, ScrollView, View} from 'react-native';
import { HomeScreenType } from './HomeScreen.type';
import { styles } from './HomeScreen.style';

const HomeScreen = ({
  children,
  pinChildren,
  disableScroll = false,
  hideBackgroundShapes = false,
}: HomeScreenType) => {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]);

  return (
    <SafeAreaView style={styles.container}>
      {!hideBackgroundShapes && (
        <View style={styles.bgContainer}>
          <View style={styles.bgShapeOne} />
          <View style={styles.bgShapeTwo} />
          <View style={styles.bgShapeThree} />
          <View style={styles.bgShapeFour} />
          <View style={styles.bgShapeFive} />
          <View style={styles.bgShapeSix} />
        </View>
      )}

      {/* תוכן מקובע מעל הרקע */}
      {pinChildren && <View style={styles.pinChildren}>{pinChildren}</View>}

      {disableScroll ? (
        <Animated.View
          style={[
            styles.staticContainer,
            styles.staticContent,
            {
            opacity: contentOpacity,
            transform: [{translateY: contentTranslateY}],
            },
          ]}>
          {children}
        </Animated.View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{translateY: contentTranslateY}],
            }}>
            {children}
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
