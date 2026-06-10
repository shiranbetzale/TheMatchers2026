import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';

import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {styles} from './MainScreen.style';
import {useLanguage} from '../../utils/LanguageProvider';
import {UserRole, getSessionRole, getSessionUser} from '../../services/session';
import api from '../../services/api';
import {mapProfileToCard} from '../../utils/generalFunction';

const isActiveCard = (card: MatchCardType) =>
  card.status !== 'archived' &&
  card.relationshipStatus !== 'engaged' &&
  card.relationshipStatus !== 'married';

const getUniqueAppCoupleCount = (
  cards: MatchCardType[],
  relationshipStatus: 'engaged' | 'married',
) => {
  const coupleKeys = new Set<string>();

  cards.forEach(card => {
    if (
      card.relationshipStatus !== relationshipStatus ||
      card.partnerOutsideApp
    ) {
      return;
    }

    const profileId = String(card.profileId || '').trim();
    const partnerProfileId = String(card.partnerProfileId || '').trim();

    if (profileId && partnerProfileId) {
      coupleKeys.add([profileId, partnerProfileId].sort().join(':'));
      return;
    }

    const names = [card.name, card.partnerName]
      .map(name =>
        String(name || '')
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean)
      .sort();

    if (names.length) {
      coupleKeys.add(names.join(':'));
    }
  });

  return coupleKeys.size;
};

const MainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {isRTL} = useLanguage();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [cards, setCards] = useState<MatchCardType[]>([]);
  const [matcherName, setMatcherName] = useState('');
  const [hasLoadedProfiles, setHasLoadedProfiles] = useState(false);

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
    setHasLoadedProfiles(false);

    try {
      const [activeResponse, archivedResponse] = await Promise.all([
        api.get('/api/profiles'),
        api.get('/api/profiles', {params: {status: 'archived'}}),
      ]);

      const activeProfiles = Array.isArray(activeResponse.data?.profiles)
        ? activeResponse.data.profiles
        : [];
      const archivedProfiles = Array.isArray(archivedResponse.data?.profiles)
        ? archivedResponse.data.profiles
        : [];

      setCards([...activeProfiles, ...archivedProfiles].map(mapProfileToCard));
    } catch (error) {
      console.warn('Failed to fetch main profiles', error);
      setCards([]);
    } finally {
      setHasLoadedProfiles(true);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [fetchProfiles]),
  );

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

  const engagedThroughAppCount = useMemo(
    () => getUniqueAppCoupleCount(cards, 'engaged'),
    [cards],
  );

  const marriedThroughAppCount = useMemo(
    () => getUniqueAppCoupleCount(cards, 'married'),
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
              {
                value: hasLoadedProfiles ? String(activeCards.length) : '...',
                label: 'cardsCount',
              },
              {
                value: hasLoadedProfiles ? String(addedThisWeekCount) : '...',
                label: 'newCards',
              },
              {
                value: hasLoadedProfiles
                  ? String(engagedThroughAppCount)
                  : '...',
                label: 'engagedThroughApp',
              },
              {
                value: hasLoadedProfiles
                  ? String(marriedThroughAppCount)
                  : '...',
                label: 'marriedThroughApp',
              },
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

        {!hasLoadedProfiles ? (
          <CustomText
            text="loading"
            customStyle={[
              styles.heroSubTitle,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        ) : lastCardsArray.length === 0 ? (
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
              navigation.navigate('Wizard', {
                mode: 'create',
                resetToken: Date.now(),
              })
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

    </HomeScreen>
  );
};

export default MainScreen;
