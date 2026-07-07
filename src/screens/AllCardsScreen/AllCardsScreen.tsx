import React, {useEffect, useState} from 'react';
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
import {getSessionRole, getSessionUser, UserRole} from '../../services/session';
import api from '../../services/api';
import {mapProfileToCard} from '../../utils/generalFunction';
import {AllCardsContent, AllCardsToolbar} from './AllCardsSections';
import {useMessage} from '../../utils/MessageProvider';
import {useLanguage} from '../../utils/LanguageProvider';
import {useCardsFilterSort} from './useCardsFilterSort';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AllCardsRouteProp = RouteProp<RootStackParamList, 'AllCardsScreen'>;

const AllCardsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AllCardsRouteProp>();
  const {showMessage} = useMessage();
  const {t} = useLanguage();
  const onlyMine = route.params?.onlyMine === true;

  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowOrderBy, setIsShowOrderBy] = useState(false);
  const [sessionUserId, setSessionUserId] = useState('');
  const [sessionRole, setSessionRole] = useState<UserRole>('user');
  const [cards, setCards] = useState<MatchCardType[]>([]);
  const [hasLoadedCards, setHasLoadedCards] = useState(false);
  const [filterValues, setFilterValues] = useState<CardsFilterValues>({});
  const [sortValue, setSortValue] = useState<CardsSortValue>('');

  useEffect(() => {
    const loadSession = async () => {
      const [sessionUser, role] = await Promise.all([
        getSessionUser(),
        getSessionRole(),
      ]);
      setSessionUserId(sessionUser?.id ?? '');
      setSessionRole(role ?? 'user');
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

  const {
    femaleCount,
    filteredAndSortedCards,
    maleCount,
    matcherOptions,
    nameOptions,
  } = useCardsFilterSort({
    cards,
    filterValues,
    sessionUserId,
    sortValue,
  });

  const closeMenus = () => {
    setIsShowFilter(false);
    setIsShowOrderBy(false);
  };

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
          setCards(current =>
            current.filter(item => item.profileId !== profileId),
          );
          showMessage({type: 'success', message: t('candidateDeleted')});
        } catch (error) {
          console.error('Failed to delete profile', error);
          showMessage({type: 'error', message: t('candidateDeleteError')});
        }
      },
    });
  };

  const isMenuOpen = isShowFilter || isShowOrderBy;

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
        currentUserRole={sessionRole}
        onDelete={deleteCandidate}
        onCardPress={card => navigation.navigate('MatchCardsScreen', {card})}
      />
    </HomeScreen>
  );
};

export default AllCardsScreen;
