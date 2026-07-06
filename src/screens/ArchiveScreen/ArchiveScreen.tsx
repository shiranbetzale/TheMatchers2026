import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import CustomText from '../../components/CustomText/CustomText';
import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../../components/CustomButton/CustomButton';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';

import {CardsFilterValues} from '../../components/CustomFilter/CustomFilter.type';
import {CardsSortValue} from '../../components/CustomOrderBy/CustomOrderBy.type';

import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import RestoreSvg from '../../assets/images/restore.svg';
import TrashSvg from '../../assets/images/trash.svg';

import {styles} from './ArchiveScreen.style';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {mapProfileToCard} from '../../utils/generalFunction';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {getSessionRole, UserRole} from '../../services/session';
import {useMessage} from '../../utils/MessageProvider';

const NO_MATCHER_FILTER_VALUE = 'noMatcher';

const getGenderKey = (gender?: string) => {
  const normalizedGender = String(gender || '')
    .trim()
    .toLowerCase();

  if (
    normalizedGender === 'male' ||
    normalizedGender === 'זכר' ||
    normalizedGender === '1'
  ) {
    return 'male';
  }

  if (
    normalizedGender === 'female' ||
    normalizedGender === 'נקבה' ||
    normalizedGender === '2'
  ) {
    return 'female';
  }

  return undefined;
};

const getRelationshipStatusTextKey = (
  status?: 'engaged' | 'married',
  gender?: string,
) => {
  const genderKey = getGenderKey(gender);

  if (status === 'married') {
    return genderKey === 'male'
      ? 'marriedStatusMale'
      : genderKey === 'female'
        ? 'marriedStatusFemale'
        : 'marriedStatus';
  }

  return genderKey === 'male'
    ? 'engagedStatusMale'
    : genderKey === 'female'
      ? 'engagedStatusFemale'
      : 'engagedStatus';
};

const ArchiveScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {isRTL, t} = useLanguage();
  const {showMessage} = useMessage();

  const [archivedCards, setArchivedCards] = useState<MatchCardType[]>([]);
  const [hasLoadedArchive, setHasLoadedArchive] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const [filterValues, setFilterValues] = useState<CardsFilterValues>({});
  const [sortValue, setSortValue] = useState<CardsSortValue>('');
  const [sessionRole, setSessionRole] = useState<UserRole>('user');

  useEffect(() => {
    getSessionRole().then(role => setSessionRole(role ?? 'user'));
  }, []);

  const fetchArchivedProfiles = React.useCallback(async () => {
    setHasLoadedArchive(false);
    setArchivedCards([]);

    try {
      const response = await api.get('/api/profiles', {
        params: {status: 'archived'},
      });

      const profiles = Array.isArray(response.data?.profiles)
        ? response.data.profiles
        : [];

      setArchivedCards(profiles.map(mapProfileToCard));
    } catch {
      setArchivedCards([]);
    } finally {
      setHasLoadedArchive(true);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsShowFilter(false);
      setIsShowOrderBy(false);
      fetchArchivedProfiles();
    }, [fetchArchivedProfiles]),
  );

  const restoreProfile = (card: MatchCardType) => {
    const profileId = String(card.profileId || '').trim();

    if (!profileId) {
      return;
    }

    navigation.navigate('Wizard', {
      mode: 'edit',
      profileId,
      card,
      restoreToAvailable: true,
    });
  };

  const deleteCandidate = (card: MatchCardType) => {
    const profileId = String(card.profileId || '').trim();

    if (!profileId || sessionRole !== 'admin') {
      return;
    }

    showMessage({
      type: 'error',
      title: t('deleteCandidateTitle'),
      message: t('deleteCandidateConfirm').replace('{{name}}', card.name),
      cancelText: t('cancel'),
      confirmText: t('delete'),
      onConfirm: async () => {
        try {
          await api.delete(`/api/profiles/${profileId}`);
          setArchivedCards(current =>
            current.filter(item => item.profileId !== profileId),
          );
          showMessage({type: 'success', message: t('candidateDeleted')});
        } catch (error) {
          console.error('Failed to delete archived profile', error);
          showMessage({type: 'error', message: t('candidateDeleteError')});
        }
      },
    });
  };

  const matcherOptions = useMemo(() => {
    const matcherNames = Array.from(
      new Set(
        archivedCards
          .map(card => card.matcherName?.trim())
          .filter((name): name is string => Boolean(name)),
      ),
    );

    return matcherNames.map((matcherName, index) => ({
      id: index + 1,
      name: 'matcherName',
      label: matcherName,
    }));
  }, [archivedCards]);

  const nameOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        archivedCards
          .map(card => card.name?.trim())
          .filter((name): name is string => Boolean(name)),
      ),
    );

    return names
      .sort((a, b) => a.localeCompare(b, 'he'))
      .map((name, index) => ({
        id: index + 1,
        name: 'name',
        label: name,
      }));
  }, [archivedCards]);

  const filteredAndSortedCards = useMemo(() => {
    return [...archivedCards]
      .filter(card => {
        const byName = filterValues.name
          ? String(card.name || '')
              .toLowerCase()
              .includes(filterValues.name.toLowerCase())
          : true;

        const byCity = filterValues.city
          ? String(card.city || '')
              .toLowerCase()
              .includes(filterValues.city.toLowerCase())
          : true;

        const byGender = filterValues.gender
          ? card.gender === filterValues.gender
          : true;

        const byMatcher =
          filterValues.matcherName === NO_MATCHER_FILTER_VALUE
            ? !String(card.matcherName || '').trim()
            : filterValues.matcherName
              ? String(card.matcherName || '') === filterValues.matcherName
              : true;

        return byName && byCity && byGender && byMatcher;
      })
      .sort((a, b) => {
        if (sortValue === 'sortName') {
          return String(a.name || '').localeCompare(String(b.name || ''), 'he');
        }

        if (sortValue === 'sortAgeAsc') {
          return (a.age || 0) - (b.age || 0);
        }

        if (sortValue === 'sortAgeDesc') {
          return (b.age || 0) - (a.age || 0);
        }

        if (sortValue === 'sortCreatedAt') {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return bTime - aTime;
        }

        return 0;
      });
  }, [archivedCards, filterValues, sortValue]);

  const {engagedCount, marriedCount} = useMemo(() => {
    return {
      engagedCount: filteredAndSortedCards.filter(
        card => card.relationshipStatus === 'engaged',
      ).length,
      marriedCount: filteredAndSortedCards.filter(
        card => card.relationshipStatus === 'married',
      ).length,
    };
  }, [filteredAndSortedCards]);

  const toggleFilter = () => {
    setIsShowOrderBy(false);
    setIsShowFilter(prev => !prev);
  };

  const toggleOrderBy = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(prev => !prev);
  };

  const closeMenus = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(false);
  };

  const applyFilter = (values: CardsFilterValues) => {
    setFilterValues(values);
    closeMenus();
  };

  const resetFilter = () => {
    setFilterValues({});
    closeMenus();
  };

  const applySort = (value: CardsSortValue) => {
    setSortValue(value);
    closeMenus();
  };

  const resetSort = () => {
    setSortValue('');
    closeMenus();
  };

  const isMenuOpen = isShowFilter || isShowOrderBy;

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <View
            style={[
              styles.actionsBar,
              isRTL ? styles.actionsBarRtl : styles.actionsBarLtr,
            ]}>
            <CustomButton
              unstyled
              activeOpacity={0.84}
              style={[
                styles.actionButton,
                isShowFilter && styles.actionButtonActive,
                isRTL ? styles.actionButtonRtl : styles.actionButtonLtr,
              ]}
              onPress={toggleFilter}>
              <FilterSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
              <CustomText
                text="filter"
                customStyle={[
                  styles.actionText,
                  isShowFilter && styles.actionTextActive,
                ]}
              />
            </CustomButton>

            <CustomButton
              unstyled
              activeOpacity={0.84}
              style={[
                styles.actionButton,
                isShowOrderBy && styles.actionButtonActive,
                isRTL ? styles.actionButtonRtl : styles.actionButtonLtr,
              ]}
              onPress={toggleOrderBy}>
              <OrderBySvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
              <CustomText
                text="sort"
                customStyle={[
                  styles.actionText,
                  isShowOrderBy && styles.actionTextActive,
                ]}
              />
            </CustomButton>
          </View>

          {isShowFilter && (
            <CustomFilter
              values={filterValues}
              nameOptions={nameOptions}
              matcherOptions={matcherOptions}
              onApply={applyFilter}
              onReset={resetFilter}
            />
          )}

          {isShowOrderBy && (
            <CustomOrderBy
              value={sortValue}
              onApply={applySort}
              onReset={resetSort}
            />
          )}
        </View>
      }>
      <View style={styles.container}>
        <WhiteCard customStyle={styles.headerCard}>
          <CustomText text="archive" customStyle={styles.title} />
          <CustomText text="archiveSubtitle" customStyle={styles.subtitle} />
        </WhiteCard>

        {!isMenuOpen && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <CustomText
                  text={`${filteredAndSortedCards.length}`}
                  customStyle={styles.statValue}
                />
                <CustomText
                  text="archiveCards"
                  customStyle={styles.statLabel}
                />
              </View>

              <View style={styles.statChip}>
                <CustomText
                  text={`${engagedCount}`}
                  customStyle={styles.statValue}
                />
                <CustomText
                  text="engagedStatus"
                  customStyle={styles.statLabel}
                />
              </View>

              <View style={styles.statChip}>
                <CustomText
                  text={`${marriedCount}`}
                  customStyle={styles.statValue}
                />
                <CustomText
                  text="marriedStatus"
                  customStyle={styles.statLabel}
                />
              </View>
            </View>

            {!hasLoadedArchive ? null : filteredAndSortedCards.length ? (
              filteredAndSortedCards.map((card, index) => (
                <WhiteCard
                  key={card.profileId || `${card.name}_${index}`}
                  customStyle={styles.archiveCard}>
                  <View
                    style={[
                      styles.relationshipBar,
                      isRTL
                        ? styles.relationshipBarRtl
                        : styles.relationshipBarLtr,
                    ]}>
                    <CustomText
                      text={`${card.name || '—'} + ${card.partnerName || '—'}`}
                      customStyle={[
                        styles.relationshipText,
                        isRTL ? styles.textRtl : styles.textLtr,
                      ]}
                    />

                    <View
                      style={[
                        styles.badgesRow,
                        isRTL ? styles.badgesRowRtl : styles.badgesRowLtr,
                      ]}>
                      {card.partnerOutsideApp && (
                        <CustomText
                          text="partnerOutsideApp"
                          customStyle={styles.externalPartnerBadge}
                        />
                      )}

                      <CustomText
                        text={getRelationshipStatusTextKey(
                          card.relationshipStatus,
                          card.gender,
                        )}
                        customStyle={styles.relationshipBadge}
                      />
                    </View>

                  </View>

                  <MatchCard
                    {...card}
                    isEmbedded
                    isSlide={false}
                    isShowMeetingInfo={false}
                    isShowInfoButtons={false}
                  />

                  <View style={styles.archiveActions}>
                    <CustomButton
                      variant="secondary"
                      text="restoreToActiveList"
                      accessibilityLabel={t('restoreToActiveList')}
                      customStyle={[
                        styles.restoreButton,
                        isRTL
                          ? styles.restoreButtonRtl
                          : styles.restoreButtonLtr,
                      ]}
                      customTextStyle={styles.restoreButtonText}
                      icon={
                        <RestoreSvg
                          width={BUTTON_ICON_SIZE}
                          height={BUTTON_ICON_SIZE}
                        />
                      }
                      onPress={() => restoreProfile(card)}
                    />
                    {sessionRole === 'admin' && card.profileId ? (
                      <CustomButton
                        unstyled
                        accessibilityLabel={t('deleteCandidate')}
                        style={styles.deleteCandidateButton}
                        onPress={() => deleteCandidate(card)}>
                        <TrashSvg
                          width={BUTTON_ICON_SIZE}
                          height={BUTTON_ICON_SIZE}
                        />
                      </CustomButton>
                    ) : null}
                  </View>
                </WhiteCard>
              ))
            ) : (
              <WhiteCard customStyle={styles.emptyCard}>
                <CustomText
                  text="archiveEmptyTitle"
                  customStyle={styles.emptyTitle}
                />
                <CustomText
                  text="archiveEmptyText"
                  customStyle={styles.emptyText}
                />
              </WhiteCard>
            )}
          </>
        )}
      </View>
    </HomeScreen>
  );
};

export default ArchiveScreen;
