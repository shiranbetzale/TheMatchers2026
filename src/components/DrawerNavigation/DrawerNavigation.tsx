import React from 'react';
import AllCardsScreen from '../../screens/AllCardsScreen/AllCardsScreen';
import MatchCardsScreen from '../../screens/MatchCardsScreen/MatchCardsScreen';
import Wizard from '../Wizard/Wizard';
import {styles} from './DrawerNavigation.style';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import CustomMenu from '../CustomMenu/CustomMenu';
import {FontsStyle} from '../../utils/FontsStyle';
import {getHeaderTitle} from '@react-navigation/elements';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({navigation}: any) => {
  const drawerArr = [
    {
      name: 'רישום משודך',
      component: Wizard,
    },
    {
      name: 'כל המשודכים',
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
  ];

  const screenOptionsProps: DrawerNavigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: FontsStyle.textDecoration,
    drawerType: 'slide',
    drawerPosition: 'right',
    header: ({navigation, route, options}) => {
      const title = getHeaderTitle(options, route.name);

      return (
        <CustomMenu
          title={title}
          onPressMenu={() => navigation.toggleDrawer()}
        />
      );
    },
  };

  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenOptionsProps}>
      {drawerArr.map((stackItem, index) => {
        return (
          <Drawer.Screen
            key={index}
            name={stackItem.name}
            component={stackItem.component}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
