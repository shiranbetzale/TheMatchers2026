import Wizard from '../components/Wizard/Wizard';
import AdminAllCardsScreen from '../screens/AdminAllCardsScreen/AdminAllCardsScreen';
import AllCardsScreen from '../screens/AllCardsScreen/AllCardsScreen';
import ArchiveScreen from '../screens/ArchiveScreen/ArchiveScreen';
import ContactScreen from '../screens/ContactScreen/ContactScreen';
import EditFormScreen from '../screens/EditFormScreen/EditFormScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/Login/Login';
import MainScreen from '../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../screens/MatchCardsScreen/MatchCardsScreen';
import MatchmakerCardsScreen from '../screens/MatchmakerCardsScreen/MatchmakerCardsScreen';
import MeetingCalendarScreen from '../screens/MeetingCalendarScreen/MeetingCalendarScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen/OnBoardingScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen/RegisterUserScreen';
import UsersListScreen from '../screens/UsersListScreen/UsersListScreen';

export const drawerData = [
  {
    name: 'Login',
    component: Login,
    isHeaderShown: false,
  },
  {
    name: 'Register',
    component: RegisterScreen,
    adminOnly: true,
  },
  {
    name: 'UsersList',
    component: UsersListScreen,
    isHeaderShown: false,
    adminOnly: true,
  },
  {
    name: 'Wizard',
    component: Wizard,
    title: 'singleRegistration',
  },
  {
    name: 'AllCardsScreen',
    component: AllCardsScreen,
    title: 'allCards',
  },
  {
    name: 'AdminAllCardsScreen',
    component: AdminAllCardsScreen,
    title: 'allCards',
    adminOnly: true,
  },
  {
    name: 'ArchiveScreen',
    component: ArchiveScreen,
    title: 'archive',
  },
  {
    name: 'MatchmakerCardsScreen',
    component: MatchmakerCardsScreen,
    title: 'myCards',
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'MatchCardsScreen',
    component: MatchCardsScreen,
    title: 'matches',
  },
  {
    name: 'MeetingCalendarScreen',
    component: MeetingCalendarScreen,
    title: 'matchmakerCalendar',
    allowedRoles: ['matchmaker', 'user'],
  },
  {
    name: 'HomeScreen',
    component: HomeScreen,
    title: 'home',
  },
  {
    name: 'MainScreen',
    component: MainScreen,
    title: 'main',
  },
  {
    name: 'ContactScreen',
    component: ContactScreen,
    title: 'contact',
  },
  {
    name: 'EditFormScreen',
    component: EditFormScreen,
    title: 'editCard',
  },
  {
    name: 'RegisterUserScreen',
    component: RegisterUserScreen,
    title: 'registerUser',
  },
  {
    name: 'OnBoarding',
    isHeaderShown: false,
    component: OnBoardingScreen,
  },
];
