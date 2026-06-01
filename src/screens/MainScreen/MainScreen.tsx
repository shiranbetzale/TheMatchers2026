import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import {UserRole, getSessionRole, getSessionUser} from '../../services/session';
import {relationshipAnnouncements} from '../../data/relationshipAnnouncements';
import api from '../../services/api';
import {mapProfileToCard} from '../../utils/generalFunction';

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

const isActiveCard = (card: MatchCardType) =>
  card.status !== 'archived' &&
  card.relationshipStatus !== 'engaged' &&
  card.relationshipStatus !== 'married';

const MainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<MainScreenRouteProp>();
  const {isRTL} = useLanguage();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [visibleAnnouncementId, setVisibleAnnouncementId] = useState<
    string | null
  >(null);
  const [cards, setCards] = useState<MatchCardType[]>([]);
  const [matcherName, setMatcherName] = useState('');

  const shouldShowMyCards = userRole !== 'user';

  useEffect(() => {
    getSessionRole().then(setUserRole);

    getSessionUser().then(sessionUser => {
      if (sessionUser?.name) {
        setMatcherName(sessionUser.name);
      }
    });
  }, []);

  const fetchProfiles = React.useCallback(async () => {
    try {
      const response = await api.get('/api/profiles');

      const profiles = Array.isArray(response.data?.profiles)
        ? response.data.profiles
        : [];

      setCards(profiles.map(mapProfileToCard));
    } catch (error) {
      console.warn('Failed to fetch main profiles', error);
      setCards([]);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [fetchProfiles]),
  );

  useEffect(() => {
    const showPendingAnnouncement = async () => {
      if (!route.params?.showCongratsAfterLogin) {
        return;
      }

      const dismissedValue = await AsyncStorage.getItem(
        VIEWED_ANNOUNCEMENT_COUPLES_KEY,
      );

      const viewedCoupleIds = parseStoredIds(dismissedValue);

      const nextAnnouncement = relationshipAnnouncements.find(
        announcement =>
          !viewedCoupleIds.includes(getAnnouncementCoupleKey(announcement)),
      );

      if (!nextAnnouncement) {
        return;
      }

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
    };

    showPendingAnnouncement();
  }, [route.params?.showCongratsAfterLogin]);

  const visibleAnnouncement = relationshipAnnouncements.find(
    announcement => announcement.id === visibleAnnouncementId,
  );

  const closeCongrats = async () => {
    if (!visibleAnnouncementId) {
      return;
    }

    setVisibleAnnouncementId(null);
  };

  const activeCards = useMemo(() => cards.filter(isActiveCard), [cards]);

  const lastCardsArray = useMemo(
    () =>
      [...activeCards]
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return bTime - aTime;
        })
        .slice(0, 3)
        .map(card => ({
          ...card,
          isShowInfoButtons: false,
          isShowMeetingInfo: false,
        })),
    [activeCards],
  );

  const engagedCount = useMemo(
    () => cards.filter(card => card.relationshipStatus === 'engaged').length,
    [cards],
  );

  const addedThisWeekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return activeCards.filter(card => {
      if (!card.createdAt) {
        return false;
      }

      const createdAtTime = new Date(card.createdAt).getTime();

      return Number.isFinite(createdAtTime) && createdAtTime >= weekAgo;
    }).length;
  }, [activeCards]);

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
                text={matcherName}
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

          <View
            style={[styles.heroStats, isRTL ? styles.rowReverse : styles.row]}>
            {[
              {value: String(activeCards.length), label: 'cardsCount'},
              {value: String(addedThisWeekCount), label: 'newCards'},
              {value: String(engagedCount), label: 'engagedThisMonth'},
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

        <View
          style={[
            styles.sectionHeader,
            isRTL ? styles.alignEnd : styles.alignStart,
          ]}>
          <CustomText text="lastCards" customStyle={styles.sectionTitle} />
        </View>

        {lastCardsArray.length === 0 ? (
          <CustomText
            text="noCardsYet"
            customStyle={[
              styles.heroSubTitle,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        ) : (
          lastCardsArray.map((item, index) => (
            <CustomButton
              key={item.profileId || item.phone || String(index)}
              onPress={() =>
                navigation.navigate('MatchCardsScreen', {card: item})
              }
              customStyle={styles.matchCard}>
              <MatchCard {...item} isSlide={false} isShowMeetingInfo={false} />
            </CustomButton>
          ))
        )}

        <View style={styles.primaryActions}>
          <CustomButton
            customStyle={styles.primaryButton}
            customTextStyle={styles.primaryButtonText}
            text="allCards"
            onPress={() => navigation.navigate('AllCardsScreen')}
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
        <View
          style={[
            styles.sectionHeader,
            isRTL ? styles.alignEnd : styles.alignStart,
          ]}>
          <CustomText text="moreActions" customStyle={styles.sectionTitle} />
        </View>

        <View
          style={[styles.shortButtons, isRTL ? styles.rowReverse : styles.row]}>
          <CustomButton
            customStyle={styles.secondaryButton}
            customTextStyle={styles.secondaryButtonText}
            text="singleRegistration"
            onPress={() =>
              navigation.navigate('Wizard', {resetToken: Date.now()})
            }
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
