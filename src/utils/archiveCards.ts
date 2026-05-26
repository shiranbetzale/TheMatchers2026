import {MatchCardType} from '../components/MatchCard/MatchCard.type';

export const isArchivedCard = (card: MatchCardType) =>
  card.relationshipStatus === 'engaged' || card.relationshipStatus === 'married';
