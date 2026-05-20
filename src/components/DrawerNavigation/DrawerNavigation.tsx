import React from 'react';
import {styles} from './DrawerNavigation.style';
import {
  createDrawerNavigator,
  DrawerHeaderProps,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import CustomMenu from '../CustomMenu/CustomMenu';
import {FontsStyle} from '../../utils/FontsStyle';
import {getHeaderTitle} from '@react-navigation/elements';
import {drawerData} from '../../data/drawerData';
import {DrawerNavigationType} from './DrawerNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';

const Drawer = createDrawerNavigator();

const renderHeader = ({navigation, route, options}: DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <CustomMenu
      title={title}
      onPressMenu={() => navigation.toggleDrawer()}
    />
  );
};

const DrawerNavigation = (props: DrawerNavigationType) => {
  const {initialRoute} = props;
  const {isRTL} = useLanguage();

  const screenOptionsProps: DrawerNavigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: FontsStyle.textDecoration,
    drawerType: 'front',
    drawerPosition: isRTL ? 'right' : 'left',
    header: renderHeader,
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
