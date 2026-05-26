import {MatchCardType} from '../components/MatchCard/MatchCard.type';

export type RelationshipAnnouncement = {
  id: string;
  status: 'engaged' | 'married';
  candidate: Pick<MatchCardType, 'name' | 'images' | 'gender'>;
  partner: Pick<MatchCardType, 'name' | 'images' | 'gender'>;
};

export const relationshipAnnouncements: RelationshipAnnouncement[] = [
  {
    id: 'david-miriam-engaged',
    status: 'engaged',
    candidate: {
      name: 'David Levi',
      gender: 'male',
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      ],
    },
    partner: {
      name: 'Miriam Cohen',
      gender: 'female',
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      ],
    },
  },
];
