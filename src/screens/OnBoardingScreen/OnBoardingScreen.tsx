import React, {useRef, useState} from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import {View, FlatList, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {styles} from './OnBoardingScreen.style';
import {carousleData} from '../../data/carousleData';
import CustomText from '../../components/CustomText/CustomText';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OnBoarding'>;

const {width} = Dimensions.get('window');

const Preview = ({
  type,
}: {
  type: 'profile' | 'preferences' | 'matches' | 'calendar' | 'ring';
}) => {
  if (type === 'profile') {
    return (
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <View style={styles.avatar}>
            <CustomText text="ש" customStyle={styles.avatarText} />
          </View>
          <View style={styles.previewTitleBlock}>
            <CustomText
              text="onboardDemoName"
              customStyle={styles.previewName}
            />
            <CustomText
              text="onboardDemoMeta"
              customStyle={styles.previewMeta}
            />
          </View>
        </View>
        <View style={styles.infoGrid}>
          {[
            'onboardDemoCity',
            'onboardDemoHeight',
            'onboardDemoOccupation',
          ].map(item => (
            <View key={item} style={styles.infoChip}>
              <CustomText text={item} customStyle={styles.infoChipText} />
            </View>
          ))}
        </View>
        <View style={styles.profileLine} />
        <View style={[styles.profileLine, styles.profileLineShort]} />
      </View>
    );
  }

  if (type === 'preferences') {
    return (
      <View style={styles.previewCard}>
        {[
          ['onboardPreferenceAge', 'onboardPreferenceAgeValue'],
          ['onboardPreferenceHeight', 'onboardPreferenceHeightValue'],
          ['onboardPreferenceWorldview', 'onboardPreferenceWorldviewValue'],
        ].map(([label, value]) => (
          <View key={label} style={styles.preferenceRow}>
            <CustomText text={label} customStyle={styles.preferenceLabel} />
            <CustomText text={value} customStyle={styles.preferenceValue} />
          </View>
        ))}
      </View>
    );
  }

  if (type === 'matches') {
    return (
      <View style={styles.previewCard}>
        <View style={styles.matchScore}>
          <CustomText text="92%" customStyle={styles.matchScoreText} />
          <CustomText
            text="onboardMatchRecommended"
            customStyle={styles.matchScoreLabel}
          />
        </View>
        {['matchReasonAge', 'matchReasonHeight', 'matchReasonHashkafa'].map(
          item => (
            <View key={item} style={styles.reasonRow}>
              <View style={styles.reasonDot} />
              <CustomText text={item} customStyle={styles.reasonText} />
            </View>
          ),
        )}
      </View>
    );
  }

  if (type === 'ring') {
    return (
      <View style={styles.previewCard}>
        <View style={styles.ringPreviewStage}>
          <View style={styles.ringCard}>
            <CustomText
              text="onboardRingCardName"
              customStyle={styles.ringCardName}
            />
            <CustomText
              text="onboardRingCardMeta"
              customStyle={styles.ringCardMeta}
            />
          </View>

          <View style={styles.floatingRingButton}>
            <View style={styles.floatingRingInner} />
          </View>
        </View>

        <View style={styles.ringActions}>
          <View style={styles.ringActionPill}>
            <CustomText
              text="engagedStatusFemale"
              customStyle={styles.ringActionText}
            />
          </View>
          <View style={styles.ringActionPill}>
            <CustomText
              text="marriedStatusFemale"
              customStyle={styles.ringActionText}
            />
          </View>
        </View>

        <CustomText
          text="onboardRingPreviewNote"
          customStyle={styles.ringPreviewNote}
        />
      </View>
    );
  }

  return (
    <View style={styles.previewCard}>
      <View style={styles.calendarTop}>
        <CustomText
          text="onboardCalendarDay"
          customStyle={styles.calendarDay}
        />
        <CustomText
          text="onboardCalendarTime"
          customStyle={styles.calendarTime}
        />
      </View>
      <View style={styles.meetingCard}>
        <CustomText
          text="meetingManagement"
          customStyle={styles.meetingTitle}
        />
        <CustomText
          text="onboardCalendarPlace"
          customStyle={styles.meetingMeta}
        />
      </View>
      <View style={styles.statusPill}>
        <CustomText
          text="onboardCalendarStatus"
          customStyle={styles.statusPillText}
        />
      </View>
    </View>
  );
};

const OnBoardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    ({viewableItems}: {viewableItems: any[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
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
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <View style={[styles.slide, {width}]}>
            <View style={styles.slideCard}>
              <CustomText text={item.eyebrow} customStyle={styles.eyebrow} />
              <Preview type={item.previewType} />
              <CustomText text={item.title} customStyle={styles.title} />
              <CustomText text={item.subtitle} customStyle={styles.subtitle} />
            </View>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      />

      <View style={styles.dotsContainer}>
        {carousleData.map((slide, index) => (
          <View
            key={slide.id ?? index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.buttonsRow}>
        {currentIndex > 0 && (
          <CustomButton
            variant="secondary"
            onPress={handlePrev}
            style={styles.prevButton}>
            <CustomText text="previous" customStyle={styles.prevButtonText} />
          </CustomButton>
        )}

        <CustomButton
          variant="ghost"
          onPress={handleSkip}
          style={styles.skipButton}>
          <CustomText text="skip" customStyle={styles.skipText} />
        </CustomButton>

        <CustomButton
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}>
          <CustomText
            text={currentIndex === carousleData.length - 1 ? 'start' : 'next'}
            customStyle={styles.nextButtonText}
          />
        </CustomButton>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
