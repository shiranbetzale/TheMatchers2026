import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CongratsModal from '../../components/CongratsModal/CongratsModal';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';

import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {styles} from './MainScreen.style';
import {useLanguage} from '../../utils/LanguageProvider';
import {UserRole, getSessionRole} from '../../services/session';
import {relationshipAnnouncements} from '../../data/relationshipAnnouncements';

type MainScreenRouteProp = RouteProp<RootStackParamList, 'MainScreen'>;

const VIEWED_ANNOUNCEMENT_COUPLES_KEY = 'viewedRelationshipAnnouncementCouples';

const getAnnouncementCoupleKey = (
  announcement: (typeof relationshipAnnouncements)[number],
) =>
  [announcement.candidate.name, announcement.partner.name]
    .map(name => name.trim().toLowerCase())
    .sort()
    .join('|');

const parseStoredIds = (value: string | null) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(item => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

const MainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<MainScreenRouteProp>();
  const {isRTL} = useLanguage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [visibleAnnouncementId, setVisibleAnnouncementId] = useState<
    string | null
  >(null);
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    getSessionRole().then(setUserRole);
  }, []);

  useEffect(() => {
    const showPendingAnnouncement = async () => {
      if (!route.params?.showCongratsAfterLogin) {
        return;
      }

      const dismissedValue =
        await AsyncStorage.getItem(VIEWED_ANNOUNCEMENT_COUPLES_KEY);
      const viewedCoupleIds = parseStoredIds(dismissedValue);
      const nextAnnouncement = relationshipAnnouncements.find(
        announcement =>
          !viewedCoupleIds.includes(getAnnouncementCoupleKey(announcement)),
      );

      if (nextAnnouncement) {
        await AsyncStorage.setItem(
          VIEWED_ANNOUNCEMENT_COUPLES_KEY,
          JSON.stringify(
            Array.from(
              new Set([
                ...viewedCoupleIds,
                getAnnouncementCoupleKey(nextAnnouncement),
              ]),
            ),
          ),
        );
        setVisibleAnnouncementId(nextAnnouncement.id);
      }
    };

    showPendingAnnouncement();
  }, [route.params?.showCongratsAfterLogin]);

  const visibleAnnouncement = relationshipAnnouncements.find(
    announcement => announcement.id === visibleAnnouncementId,
  );
  const shouldShowMyCards = !isAdmin;

  const closeCongrats = async () => {
    if (!visibleAnnouncementId) {
      return;
    }
    setVisibleAnnouncementId(null);
  };

  const name = 'matchmakerShiranBetzalel';
  const matcherName = 'matchmakerShiranBetzalel';

  const lastCardsArray: MatchCardType[] = [
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName,
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'male',
      age: 50,
      height: '1.85',
      status: 'divorced',
      numOfChildren: 0,
      images: [
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName,
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'female',
      age: 54,
      height: '1.80',
      status: 'widower',
      numOfChildren: 1,
      images: [
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName,
      name: 'XXX',
      offered: false,
      met: false,
      gender: 'female',
      age: 50,
      height: '1.85',
      status: 'single',
      numOfChildren: 5,
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
  ];

  return (
    <HomeScreen>
      <View style={styles.container}>
        <WhiteCard customStyle={styles.heroCard}>
          <View
            style={[
              styles.heroTextBlock,
              isRTL ? styles.alignEnd : styles.alignStart,
            ]}>
            <View style={[isRTL ? styles.rowReverse : styles.row]}>
              <CustomText
                text="hello"
                customStyle={[
                  styles.name,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
              <CustomText
                text={isRTL ? ' ' : ', '}
                customStyle={[
                  styles.name,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
              <CustomText
                text={name}
                customStyle={[
                  styles.name,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
              {isRTL && (
                <CustomText
                  text=","
                  customStyle={[
                    styles.name,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
              )}
            </View>
            <CustomText
              text="mainHeroSubtitle"
              customStyle={[
                styles.heroSubTitle,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />
          </View>
          <View style={[styles.heroStats, isRTL ? styles.rowReverse : styles.row]}>
            {[
              {value: '8', label: 'cardsCount'},
              {value: '3', label: 'newCards'},
              {value: '2', label: 'engagedThisMonth'},
            ].map((stat, index, stats) => (
              <React.Fragment key={stat.label}>
                <View style={styles.heroStat}>
                  <CustomText
                    text={stat.value}
                    customStyle={styles.heroStatValue}
                  />
                  <CustomText
                    text={stat.label}
                    customStyle={styles.heroStatLabel}
                  />
                </View>
                {index < stats.length - 1 && (
                  <View style={styles.heroStatDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </WhiteCard>

        <View style={[styles.sectionHeader, isRTL ? styles.alignEnd : styles.alignStart]}>
          <CustomText text="lastCards" customStyle={styles.sectionTitle} />
        </View>

        {lastCardsArray.map((item, index) => {
          return (
            <CustomButton
              key={index}
              onPress={() => navigation.navigate('MatchCardsScreen')}
              customStyle={styles.matchCard}>
              <MatchCard {...item} isSlide={false} />
            </CustomButton>
          );
        })}

        <View style={styles.primaryActions}>
          <CustomButton
            customStyle={styles.primaryButton}
            customTextStyle={styles.primaryButtonText}
            text="allCards"
            onPress={() =>
              navigation.navigate(
                isAdmin ? 'AdminAllCardsScreen' : 'AllCardsScreen',
              )
            }
          />

          {shouldShowMyCards && (
            <CustomButton
              customStyle={styles.secondaryFullButton}
              customTextStyle={styles.secondaryButtonText}
              text="matchmakerCards"
              onPress={() =>
                navigation.navigate('AllCardsScreen', {onlyMine: true})
              }
            />
          )}
        </View>
      </View>

      <WhiteCard customStyle={styles.actionsCard}>
        <View style={[styles.sectionHeader, isRTL ? styles.alignEnd : styles.alignStart]}>
          <CustomText text="moreActions" customStyle={styles.sectionTitle} />
        </View>

        <View style={[styles.shortButtons, isRTL ? styles.rowReverse : styles.row]}>
          <CustomButton
            customStyle={styles.secondaryButton}
            customTextStyle={styles.secondaryButtonText}
            text="singleRegistration"
            onPress={() => navigation.navigate('Wizard')}
          />
          <CustomButton
            customStyle={styles.secondaryButton}
            customTextStyle={styles.secondaryButtonText}
            text="contact"
            onPress={() => navigation.navigate('ContactScreen')}
          />
        </View>
      </WhiteCard>
      <CongratsModal
        announcement={visibleAnnouncement}
        visible={Boolean(visibleAnnouncement)}
        onClose={closeCongrats}
      />
    </HomeScreen>
  );
};

export default MainScreen;
