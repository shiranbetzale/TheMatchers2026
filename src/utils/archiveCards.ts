import {MatchCardType} from '../components/MatchCard/MatchCard.type';

export const isArchivedCard = (card: MatchCardType) =>
  String(card.status || '')
    .trim()
    .toLowerCase() === 'archived' ||
  String(card.relationshipStatus || '')
    .trim()
    .toLowerCase() === 'engaged' ||
  String(card.relationshipStatus || '')
    .trim()
    .toLowerCase() === 'married';
