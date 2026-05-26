import {MatchCardType} from '../MatchCard/MatchCard.type';

type detail = {
  text: string;
  info: any;
};

export type SelectedCardType = {
  card: MatchCardType;
  details: detail[];
  onMeetingPress?: () => void;
  isShowMeetingButton?: boolean;
};
