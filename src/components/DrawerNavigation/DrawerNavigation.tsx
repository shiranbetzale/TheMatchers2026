import React from 'react';
import AllCardsScreen from '../../screens/AllCardsScreen/AllCardsScreen';
import MatchCardsScreen from '../../screens/MatchCardsScreen/MatchCardsScreen';
import Wizard from '../Wizard/Wizard';
import { styles } from './DrawerNavigation.style';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import CustomMenu from '../CustomMenu/CustomMenu';
import { FontsStyle } from '../../utils/FontsStyle';
import { getHeaderTitle } from '@react-navigation/elements';
import Login from '../../screens/Login/Login';
import MainScreen from '../../screens/MainScreen/MainScreen';
import EditFormScreen from '../../screens/EditFormScreen/EditFormScreen';
import RegisterUserScreen from '../../screens/RegisterUserScreen/RegisterUserScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: any) => {
  const drawerArr = [
    {
      name: 'Login',
      component: Login,
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
  ];

  const screenOptionsProps: DrawerNavigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: FontsStyle.textDecoration,
    drawerType: "front",
    drawerPosition: "right",
    header: ({ navigation, route, options }) => {
      const title = getHeaderTitle(options, route.name);

      return (
        <CustomMenu
          title={title}
          onPressMenu={() => navigation.toggleDrawer()}
          navigation={navigation}
        />
      );
    }
  }

  return (
    <Drawer.Navigator
      initialRouteName="Login"
      screenOptions={screenOptionsProps}
    >
      {
        drawerArr.map((stackItem, index) => {
          return <Drawer.Screen
            key={index}
            name={stackItem.name}
            component={stackItem.component}
            options={{ headerShown: stackItem.isHeaderShown }}
          />
        })
      }
    </Drawer.Navigator >
  );
};

export default DrawerNavigation;
