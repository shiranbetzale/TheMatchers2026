import Wizard from '../components/Wizard/Wizard';
import AllCardsScreen from '../screens/AllCardsScreen/AllCardsScreen';
import ArchiveScreen from '../screens/ArchiveScreen/ArchiveScreen';
import ContactScreen from '../screens/ContactScreen/ContactScreen';
import ContactRequestsScreen from '../screens/ContactRequestsScreen/ContactRequestsScreen';
import EditFormScreen from '../screens/EditFormScreen/EditFormScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/Login/Login';
import LogsScreen from '../screens/LogsScreen/LogsScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../screens/MatchCardsScreen/MatchCardsScreen';
import MeetingCalendarScreen from '../screens/MeetingCalendarScreen/MeetingCalendarScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen/OnBoardingScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen/RegisterUserScreen';
import UsersListScreen from '../screens/UsersListScreen/UsersListScreen';

export const drawerData = [
  {
    name: 'Login',
    component: Login,
    isHeaderShown: false,
    hideInDrawer: true,
  },
  {
    name: 'UsersList',
    component: UsersListScreen,
    title: 'usersList',
    allowedRoles: ['admin'],
  },
  {
    name: 'ContactRequestsScreen',
    component: ContactRequestsScreen,
    title: 'contactRequests',
    allowedRoles: ['admin'],
  },
  {
    name: 'LogsScreen',
    component: LogsScreen,
    title: 'logs',
    allowedRoles: ['admin'],
  },
  {
    name: 'Wizard',
    component: Wizard,
    title: 'singleRegistration',
    allowedRoles: ['admin', 'matchmaker', 'user'],
  },
  {
    name: 'AllCardsScreen',
    component: AllCardsScreen,
    title: 'allCards',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'ArchiveScreen',
    component: ArchiveScreen,
    title: 'archive',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'MyCardsScreen',
    component: AllCardsScreen,
    title: 'myCards',
    allowedRoles: ['admin', 'matchmaker'],
    initialParams: {onlyMine: true},
  },
  {
    name: 'MatchCardsScreen',
    component: MatchCardsScreen,
    title: 'matches',
    hideInDrawer: true,
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'MeetingCalendarScreen',
    component: MeetingCalendarScreen,
    title: 'matchmakerCalendar',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'HomeScreen',
    component: HomeScreen,
    title: 'home',
    hideInDrawer: true,
    allowedRoles: ['admin', 'matchmaker', 'user'],
  },
  {
    name: 'MainScreen',
    component: MainScreen,
    title: 'main',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'ContactScreen',
    component: ContactScreen,
    title: 'contact',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'EditFormScreen',
    component: EditFormScreen,
    title: 'editCard',
    hideInDrawer: true,
    allowedRoles: ['admin'],
  },
  {
    name: 'RegisterUserScreen',
    component: RegisterUserScreen,
    title: 'registerUser',
    allowedRoles: ['admin'],
  },
  {
    name: 'OnBoarding',
    isHeaderShown: false,
    component: OnBoardingScreen,
    hideInDrawer: true,
  },
];
