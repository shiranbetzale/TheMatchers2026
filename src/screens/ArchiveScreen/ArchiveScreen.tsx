import React, {useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import CustomText from '../../components/CustomText/CustomText';
import CustomButton from '../../components/CustomButton/CustomButton';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';

import {CardsFilterValues} from '../../components/CustomFilter/CustomFilter.type';
import {CardsSortValue} from '../../components/CustomOrderBy/CustomOrderBy.type';

import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import RestoreSvg from '../../assets/images/restore.svg';

import {styles} from './ArchiveScreen.style';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {mapProfileToCard} from '../../utils/generalFunction';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';

type ArchiveNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const NO_MATCHER_FILTER_VALUE = 'noMatcher';

const ArchiveScreen = () => {
  const {isRTL} = useLanguage();
  const navigation = useNavigation<ArchiveNavigationProp>();

  const [archivedCards, setArchivedCards] = useState<MatchCardType[]>([]);
  const [hasLoadedArchive, setHasLoadedArchive] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const [filterValues, setFilterValues] = useState<CardsFilterValues>({});
  const [sortValue, setSortValue] = useState<CardsSortValue>('');

  const fetchArchivedProfiles = React.useCallback(async () => {
    setHasLoadedArchive(false);

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
    if (!card.profileId) {
      return;
    }

    navigation.navigate('Wizard', {
      mode: 'edit',
      profileId: card.profileId,
      card,
      restoreToAvailable: true,
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

  const headerBtns = [
    {comp: <FilterSvg />, onPress: toggleFilter},
    {comp: <OrderBySvg />, onPress: toggleOrderBy},
  ];

  const isMenuOpen = isShowFilter || isShowOrderBy;

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinChildrenContainer}>
          <CustomHeader headerBtns={headerBtns} actionsPosition="left" />

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
                <View
                  key={card.profileId || `${card.name}_${index}`}
                  style={styles.cardBlock}>
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
                        text={
                          card.relationshipStatus === 'married'
                            ? 'marriedStatus'
                            : 'engagedStatus'
                        }
                        customStyle={styles.relationshipBadge}
                      />
                    </View>
                  </View>

                  <MatchCard
                    {...card}
                    isSlide={false}
                    isShowMeetingInfo={false}
                    isShowInfoButtons={false}
                  />

                  <TouchableOpacity
                    activeOpacity={0.82}
                    accessibilityRole="button"
                    accessibilityLabel="חזר להיות פנוי"
                    style={styles.restoreIconButton}
                    onPress={() => restoreProfile(card)}>
                    <RestoreSvg width={24} height={24} />
                  </TouchableOpacity>
                </View>
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
