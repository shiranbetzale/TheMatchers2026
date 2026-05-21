import React, {useEffect, useState} from 'react';
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
import MainScreen from '../../screens/MainScreen/MainScreen';
import {UserRole, getSessionRole} from '../../services/session';

const Drawer = createDrawerNavigator();

const renderHeader = ({navigation, route, options}: DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <CustomMenu
      title={title}
      isBackHidden={route.name === 'MainScreen'}
      onPressMenu={() => navigation.toggleDrawer()}
    />
  );
};

const DrawerNavigation = (props: DrawerNavigationType) => {
  const {initialRoute} = props;
  const {isRTL} = useLanguage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    getSessionRole().then(setUserRole);
  }, []);

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
      backBehavior="history"
      screenOptions={screenOptionsProps}>
      {drawerData.map((stackItem, index) => {
        const isAuthScreen =
          stackItem.name === 'Login' || stackItem.name === 'OnBoarding';
        const isRoleBlocked =
          (stackItem.adminOnly && userRole !== 'admin') ||
          (stackItem.allowedRoles &&
            (!userRole || !stackItem.allowedRoles.includes(userRole)));

        return (
          <Drawer.Screen
            key={index}
            name={stackItem.name}
            component={isRoleBlocked ? MainScreen : stackItem.component}
            options={{
              headerShown: stackItem.isHeaderShown,
              drawerItemStyle: isAuthScreen || isRoleBlocked
                ? {display: 'none'}
                : undefined,
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
