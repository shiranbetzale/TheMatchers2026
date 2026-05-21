import {MatchCardType} from '../MatchCard/MatchCard.type';

export type MainStackNavigationType = {};

export type RootStackParamList = {
  EditFormScreen: {card?: MatchCardType} | undefined;
  Login: undefined;
  MatchCardsScreen: undefined;
  MatchmakerCardsScreen: undefined;
  Settings: undefined;
  Register: undefined;
  RegisterUserScreen: undefined;
  UsersList: undefined;
  Wizard: undefined;
  HomeScreen: undefined;
  MainScreen: undefined;
  AllCardsScreen: undefined;
  AdminAllCardsScreen: undefined;
  ContactScreen: undefined;
  OnBoarding: undefined;
};
