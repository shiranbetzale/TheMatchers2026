import React, {useEffect, useMemo, useState} from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomFilter from '../../components/CustomFilter/CustomFilter';
import CustomOrderBy from '../../components/CustomOrderBy/CustomOrderBy';
import {CardsFilterValues} from '../../components/CustomFilter/CustomFilter.type';
import {CardsSortValue} from '../../components/CustomOrderBy/CustomOrderBy.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {getSessionUser} from '../../services/session';
import api from '../../services/api';
import {mapProfileToCard} from '../../utils/generalFunction';
import {AllCardsContent, AllCardsToolbar} from './AllCardsSections';

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

  const addNewCandidate = () => {
    closeMenus();
    navigation.navigate('Wizard', {
      mode: 'create',
      resetToken: Date.now(),
    });
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
  const {maleCount, femaleCount} = useMemo(
    () => ({
      maleCount: filteredAndSortedCards.filter(
        card => card.gender === 'male' || card.gender === 'זכר',
      ).length,
      femaleCount: filteredAndSortedCards.filter(
        card => card.gender === 'female' || card.gender === 'נקבה',
      ).length,
    }),
    [filteredAndSortedCards],
  );

  return (
    <HomeScreen
      pinChildren={
        <AllCardsToolbar
          isFilterOpen={isShowFilter}
          isSortOpen={isShowOrderBy}
          onAdd={addNewCandidate}
          onFilter={toggleFilter}
          onSort={toggleOrderBy}>
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
        </AllCardsToolbar>
      }>
      <AllCardsContent
        cards={filteredAndSortedCards}
        femaleCount={femaleCount}
        hasLoaded={hasLoadedCards}
        isMenuOpen={isMenuOpen}
        maleCount={maleCount}
        onlyMine={onlyMine}
        onCardPress={card => navigation.navigate('MatchCardsScreen', {card})}
      />
    </HomeScreen>
  );
};

export default AllCardsScreen;
