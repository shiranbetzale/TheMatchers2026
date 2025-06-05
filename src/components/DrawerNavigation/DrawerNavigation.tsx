import React from 'react';
import {styles} from './DrawerNavigation.style';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import CustomMenu from '../CustomMenu/CustomMenu';
import {FontsStyle} from '../../utils/FontsStyle';
import {getHeaderTitle} from '@react-navigation/elements';
import {drawerData} from '../../data/drawerData';
import {DrawerNavigationType} from './DrawerNavigation.type';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props: DrawerNavigationType) => {
  const {initialRoute} = props;

  const screenOptionsProps: DrawerNavigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: FontsStyle.textDecoration,
    drawerType: 'front',
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
      initialRouteName={initialRoute}
      screenOptions={screenOptionsProps}>
      {drawerData.map((stackItem, index) => {
        return (
          <Drawer.Screen
            key={index}
            name={stackItem.name}
            component={stackItem.component}
            options={{headerShown: stackItem.isHeaderShown}}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
