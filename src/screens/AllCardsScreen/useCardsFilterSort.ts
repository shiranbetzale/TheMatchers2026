import {useMemo} from 'react';
import {CardsFilterValues} from '../../components/CustomFilter/CustomFilter.type';
import {CardsSortValue} from '../../components/CustomOrderBy/CustomOrderBy.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';

const NO_MATCHER_FILTER_VALUE = 'noMatcher';

export const useCardsFilterSort = ({
  cards,
  filterValues,
  sessionUserId,
  sortValue,
}: {
  cards: MatchCardType[];
  filterValues: CardsFilterValues;
  sessionUserId: string;
  sortValue: CardsSortValue;
}) => {
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

  const {maleCount, femaleCount} = useMemo(
    () => ({
      maleCount: filteredAndSortedCards.filter(card => card.gender === 'male')
        .length,
      femaleCount: filteredAndSortedCards.filter(card => card.gender === 'female')
        .length,
    }),
    [filteredAndSortedCards],
  );

  return {
    femaleCount,
    filteredAndSortedCards,
    maleCount,
    matcherOptions,
    nameOptions,
  };
};
