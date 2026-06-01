import {MatchCardType} from '../MatchCard/MatchCard.type';

export type MainStackNavigationType = {};

export type RootStackParamList = {
  EditFormScreen: {card?: MatchCardType} | undefined;
  Login: undefined;
  MatchCardsScreen:
    | {card?: MatchCardType; openMeetingModal?: boolean}
    | undefined;
  MeetingCalendarScreen: {meetings?: MatchCardType[]} | undefined;
  Settings: undefined;
  Register: undefined;
  RegisterUserScreen: undefined;
  UsersList: undefined;
  Wizard: {resetToken?: number} | undefined;
  HomeScreen: undefined;
  MainScreen: {showCongratsAfterLogin?: boolean} | undefined;
  AllCardsScreen: {onlyMine?: boolean} | undefined;
  ArchiveScreen: undefined;
  ContactScreen: undefined;
  OnBoarding: undefined;
};
