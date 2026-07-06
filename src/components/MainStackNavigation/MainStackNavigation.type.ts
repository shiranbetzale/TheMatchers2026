import {MatchCardType} from '../MatchCard/MatchCard.type';

export type MainStackNavigationType = {};

export type RootStackParamList = {
  EditFormScreen: {card?: MatchCardType} | undefined;
  Login: undefined;
  MatchCardsScreen:
    | {card?: MatchCardType; openMeetingModal?: boolean; meetingEditToken?: number}
    | undefined;
  MeetingCalendarScreen: {meetings?: MatchCardType[]} | undefined;
  Settings: undefined;
  Register: undefined;
  RegisterUserScreen: undefined;
  UsersList: undefined;
  StatisticsScreen: undefined;
  Wizard:
    | {
        resetToken?: number;
        mode?: 'create' | 'edit';
        profileId?: string;
        card?: MatchCardType;
        restoreToAvailable?: boolean;
        candidatePhone?: string;
        matchmakerPhone?: string;
      }
    | undefined;
  HomeScreen: undefined;
  MainScreen: {showCongratsAfterLogin?: boolean} | undefined;
  AllCardsScreen: {onlyMine?: boolean} | undefined;
  ArchiveScreen: undefined;
  ContactScreen: undefined;
  ContactRequestsScreen: undefined;
  OnBoarding: undefined;
};
