import Wizard from '../components/Wizard/Wizard';
import AllCardsScreen from '../screens/AllCardsScreen/AllCardsScreen';
import EditFormScreen from '../screens/EditFormScreen/EditFormScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Login from '../screens/Login/Login';
import MainScreen from '../screens/MainScreen/MainScreen';
import MatchCardsScreen from '../screens/MatchCardsScreen/MatchCardsScreen';
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
    isHeaderShown: false,
  },
  {
    name: 'UsersList',
    component: UsersListScreen,
    isHeaderShown: false,
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
