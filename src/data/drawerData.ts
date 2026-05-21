import Wizard from '../components/Wizard/Wizard';
import AdminAllCardsScreen from '../screens/AdminAllCardsScreen/AdminAllCardsScreen';
import AllCardsScreen from '../screens/AllCardsScreen/AllCardsScreen';
import ContactScreen from '../screens/ContactScreen/ContactScreen';
import EditFormScreen from '../screens/EditFormScreen/EditFormScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/Login/Login';
import MainScreen from '../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../screens/MatchCardsScreen/MatchCardsScreen';
import MatchmakerCardsScreen from '../screens/MatchmakerCardsScreen/MatchmakerCardsScreen';
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
  },
  {
    name: 'AllCardsScreen',
    component: AllCardsScreen,
  },
  {
    name: 'AdminAllCardsScreen',
    component: AdminAllCardsScreen,
    adminOnly: true,
  },
  {
    name: 'MatchmakerCardsScreen',
    component: MatchmakerCardsScreen,
    allowedRoles: ['admin', 'matchmaker'],
  },
  {
    name: 'MatchCardsScreen',
    component: MatchCardsScreen,
  },
  {
    name: 'HomeScreen',
    component: HomeScreen,
  },
  {
    name: 'MainScreen',
    component: MainScreen,
  },
  {
    name: 'ContactScreen',
    component: ContactScreen,
  },
  {
    name: 'EditFormScreen',
    component: EditFormScreen,
  },
  {
    name: 'RegisterUserScreen',
    component: RegisterUserScreen,
  },
  {
    name: 'OnBoarding',
    isHeaderShown: false,
    component: OnBoardingScreen,
  },
];
