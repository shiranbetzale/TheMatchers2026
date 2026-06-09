import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import {CardsFilterValues} from '../../components/CustomFilter/CustomFilter.type';
import {CardsSortValue} from '../../components/CustomOrderBy/CustomOrderBy.type';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './AllCardsScreen.style';
import CustomText from '../../components/CustomText/CustomText';
import {FontsStyle} from '../../utils/FontsStyle';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {getSessionUser} from '../../services/session';
import api from '../../services/api';
import {mapProfileToCard} from '../../utils/generalFunction';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AllCardsRouteProp = RouteProp<RootStackParamList, 'AllCardsScreen'>;
const NO_MATCHER_FILTER_VALUE = 'noMatcher';

const AllCardsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AllCardsRouteProp>();

  const onlyMine = route.params?.onlyMine === true;

  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const [sessionUserId, setSessionUserId] = useState('');
  const [cards, setCards] = useState<MatchCardType[]>([]);
  const [hasLoadedCards, setHasLoadedCards] = useState(false);
  const [filterValues, setFilterValues] = useState<CardsFilterValues>({});
  const [sortValue, setSortValue] = useState<CardsSortValue>('');

  useEffect(() => {
    const loadSession = async () => {
      const sessionUser = await getSessionUser();
      setSessionUserId(sessionUser?.id ?? '');
    };

    loadSession();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsShowFilter(false);
      setIsShowOrderBy(false);
    }, []),
  );

  const fetchProfiles = React.useCallback(async () => {
    setHasLoadedCards(false);

    try {
      const response = await api.get('/api/profiles', {
        params: onlyMine ? {scope: 'mine'} : undefined,
      });

      const profiles = Array.isArray(response.data?.profiles)
        ? response.data.profiles
        : [];

      setCards(profiles.map(mapProfileToCard));
    } catch (error) {
      console.error('Failed to load profiles', error);
      setCards([]);
    } finally {
      setHasLoadedCards(true);
    }
  }, [onlyMine]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [fetchProfiles]),
  );

  const matcherOptions = useMemo(() => {
    const matcherNames = new Set<string>();

    cards.forEach(card => {
      if (card.matcherName?.trim()) {
        matcherNames.add(card.matcherName.trim());
      }
    });

    return Array.from(matcherNames).map((matcherName, index) => ({
      id: index + 1,
      name: 'matcherName',
      label: matcherName,
    }));
  }, [cards]);

  const nameOptions = useMemo(() => {
    const names = new Set<string>();

    cards.forEach(card => {
      if (card.name?.trim()) {
        names.add(card.name.trim());
      }
    });

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b, 'he'))
      .map((name, index) => ({
        id: index + 1,
        name: 'name',
        label: name,
      }));
  }, [cards]);

  const visibleCards = useMemo(() => {
    const active = cards.filter(
      card =>
        card.status !== 'archived' &&
        card.relationshipStatus !== 'engaged' &&
        card.relationshipStatus !== 'married',
    );

    if (filterValues.isMyCards) {
      if (!sessionUserId) {
        return [];
      }

      return active.filter(
        card => String(card.assignedMatchmaker || '') === String(sessionUserId),
      );
    }

    return active;
  }, [cards, filterValues.isMyCards, sessionUserId]);

  const filteredAndSortedCards = useMemo(() => {
    return [...visibleCards]
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
  }, [visibleCards, filterValues, sortValue]);

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
              values={{
                ...filterValues,
                isMyCards: onlyMine ? true : filterValues.isMyCards,
              }}
              isMyCards={onlyMine}
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
      {!isMenuOpen && (
        <>
          {!hasLoadedCards ? null : filteredAndSortedCards.length === 0 ? (
            <CustomText text="noAssignedCards" customStyle={FontsStyle.text} />
          ) : (
            filteredAndSortedCards.map((matchItem, index) => (
              <CustomButton
                key={matchItem.profileId || matchItem.phone || String(index)}
                onPress={() =>
                  navigation.navigate('MatchCardsScreen', {card: matchItem})
                }
                customStyle={styles.matchCard}>
                <MatchCard
                  {...matchItem}
                  isSlide={false}
                  isShowMeetingInfo={false}
                />
              </CustomButton>
            ))
          )}
        </>
      )}
    </HomeScreen>
  );
};

export default AllCardsScreen;
