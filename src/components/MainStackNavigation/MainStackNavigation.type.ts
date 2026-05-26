import {MatchCardType} from '../MatchCard/MatchCard.type';

export type MainStackNavigationType = {};

export type RootStackParamList = {
  EditFormScreen: {card?: MatchCardType} | undefined;
  Login: undefined;
  MatchCardsScreen: undefined;
  MeetingCalendarScreen: {meetings?: MatchCardType[]} | undefined;
  MatchmakerCardsScreen: undefined;
  Settings: undefined;
  Register: undefined;
  RegisterUserScreen: undefined;
  UsersList: undefined;
  Wizard: undefined;
  HomeScreen: undefined;
  MainScreen: {showCongratsAfterLogin?: boolean} | undefined;
  AllCardsScreen: {onlyMine?: boolean} | undefined;
  AdminAllCardsScreen: undefined;
  ArchiveScreen: undefined;
  ContactScreen: undefined;
  OnBoarding: undefined;
};
