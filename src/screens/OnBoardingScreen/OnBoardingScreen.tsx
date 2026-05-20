import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../components/MainStackNavigation/MainStackNavigation.type';
import { styles } from './OnBoardingScreen.style';
import { carousleData } from '../../data/carousleData';
import { useLanguage } from '../../utils/LanguageProvider';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'OnBoarding'
>;

const { width } = Dimensions.get('window');

const OnBoardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { t } = useLanguage();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.navigate('Login');
  };

  const handleNext = () => {
    if (currentIndex < carousleData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.bgShapeOne} />
      <View style={styles.bgShapeTwo} />
      <FlatList
        ref={flatListRef}
        data={carousleData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.slideCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>
                {t(item.title)}
              </Text>
            </View>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.dotsContainer}>
        {carousleData.map((slide, index) => (
          <View
            key={slide.id ?? index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonsRow}>
        {currentIndex > 0 && (
          <TouchableOpacity
            onPress={handlePrev}
            style={styles.prevButton}
          >
            <Text style={styles.prevButtonText}>
              {t('previous')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>
            {t('skip')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === carousleData.length - 1
              ? t('start')
              : t('next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
