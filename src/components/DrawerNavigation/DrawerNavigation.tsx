import React, {useCallback, useEffect, useState} from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerHeaderProps,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {Text, TouchableOpacity, View} from 'react-native';

import ArchiveIcon from '../../assets/images/orderBy.svg';
import CalendarIcon from '../../assets/images/datePicker.svg';
import CardsIcon from '../../assets/images/cards.svg';
import ContactIcon from '../../assets/images/phone.svg';
import EditIcon from '../../assets/images/edit.svg';
import LogoutIcon from '../../assets/images/logout.svg';
import MenuIcon from '../../assets/images/menu.svg';
import UserAddIcon from '../../assets/images/userAdd.svg';

import {drawerData} from '../../data/drawerData';
import {
  UserRole,
  clearSession,
  getSessionRole,
  getSessionUser,
} from '../../services/session';
import {useLanguage} from '../../utils/LanguageProvider';
import {FontsStyle} from '../../utils/FontsStyle';
import CustomMenu from '../CustomMenu/CustomMenu';
import CustomText from '../CustomText/CustomText';
import {DrawerNavigationType} from './DrawerNavigation.type';
import {styles} from './DrawerNavigation.style';

const Drawer = createDrawerNavigator();
const iconProps = {width: 18, height: 18};

const getDrawerIcon = (routeName: string) => {
  switch (routeName) {
    case 'Wizard':
      return <EditIcon {...iconProps} />;
    case 'AllCardsScreen':
    case 'MyCardsScreen':
    case 'MatchCardsScreen':
      return <CardsIcon {...iconProps} />;
    case 'ArchiveScreen':
      return <ArchiveIcon {...iconProps} />;
    case 'MeetingCalendarScreen':
      return <CalendarIcon {...iconProps} />;
    case 'ContactScreen':
      return <ContactIcon {...iconProps} />;
    case 'EditFormScreen':
      return <EditIcon {...iconProps} />;
    case 'UsersList':
    case 'RegisterUserScreen':
      return <UserAddIcon {...iconProps} />;
    case 'HomeScreen':
    case 'MainScreen':
    default:
      return <MenuIcon {...iconProps} />;
  }
};

const DrawerHeader = ({navigation, route}: DrawerHeaderProps) => (
  <CustomMenu
    isBackHidden={route.name === 'MainScreen'}
    onPressMenu={() => navigation.toggleDrawer()}
  />
);

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const {descriptors, navigation, state} = props;
  const {isRTL} = useLanguage();

  const [profileName, setProfileName] = useState('');

  const visibleRoutes = state.routes.filter(route => {
    const descriptor = descriptors[route.key];
    const drawerItemStyle = descriptor?.options?.drawerItemStyle as
      | {display?: string}
      | undefined;

    return drawerItemStyle?.display !== 'none';
  });

  const drawerRoutes = visibleRoutes.length > 0 ? visibleRoutes : state.routes;

  const logout = async () => {
    await clearSession();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      getSessionUser().then(user => {
        if (mounted && user?.name) {
          setProfileName(user.name);
        }
      });

      return () => {
        mounted = false;
      };
    }, []),
  );

  const profileInitial =
    profileName.trim().charAt(0).toUpperCase() || (isRTL ? 'ש' : 'S');

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerLogo}>
          <Text style={styles.drawerLogoText}>TM</Text>
        </View>

        <Text style={styles.drawerBrand}>The Matchers</Text>

        <CustomText
          text="mainHeroSubtitle"
          customStyle={styles.drawerSubtitle}
        />
      </View>

      <View style={styles.drawerProfileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{profileInitial}</Text>
        </View>

        <View style={styles.profileTextBlock}>
          <Text style={styles.profileName}>{profileName}</Text>

          <CustomText
            text="activeMatchmaker"
            customStyle={styles.profileRole}
          />
        </View>
      </View>

      <View style={styles.drawerSection}>
        {drawerRoutes.map(route => {
          const descriptor = descriptors[route.key];
          const labelKey = String(descriptor?.options?.title || route.name);
          const isFocused = state.routes[state.index]?.key === route.key;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.84}
              onPress={() => {
                if (route.name === 'Wizard') {
                  navigation.navigate('Wizard', {
                    mode: 'create',
                    resetToken: Date.now(),
                  });
                  return;
                }

                navigation.navigate(route.name);
              }}
              style={[
                styles.drawerItem,
                isRTL ? styles.drawerItemRtl : styles.drawerItemLtr,
                isFocused && styles.drawerItemActive,
              ]}>
              <View
                style={[
                  styles.drawerItemIcon,
                  isFocused && styles.drawerItemIconActive,
                ]}>
                {getDrawerIcon(route.name)}
              </View>

              <CustomText
                text={labelKey}
                customStyle={[
                  styles.drawerItemText,
                  isFocused && styles.drawerItemTextActive,
                  isRTL ? styles.drawerTextRight : styles.drawerTextLeft,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.84}
        onPress={logout}
        style={styles.logoutButton}>
        <View style={styles.logoutIcon}>
          <LogoutIcon width={20} height={20} />
        </View>

        <CustomText text="logout" customStyle={styles.logoutText} />
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = (props: DrawerNavigationType) => {
  const {initialRoute} = props;
  const {isRTL} = useLanguage();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [roleResolved, setRoleResolved] = useState(false);

  const loadRole = useCallback(() => {
    let mounted = true;

    getSessionRole()
      .then(role => {
        if (mounted) {
          setUserRole(role);
        }
      })
      .catch(() => {
        if (mounted) {
          setUserRole(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setRoleResolved(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(loadRole, [loadRole]);
  useFocusEffect(loadRole);

  const canUseDrawer =
    roleResolved && (userRole === 'admin' || userRole === 'matchmaker');

  const screenOptionsProps: DrawerNavigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: FontsStyle.textDecoration,
    drawerType: 'front',
    drawerPosition: isRTL ? 'right' : 'left',
    drawerStyle: styles.drawerStyle,
    overlayColor: 'rgba(6, 26, 54, 0.42)',
    swipeEnabled: canUseDrawer,
    headerShown: canUseDrawer,
    header: canUseDrawer ? DrawerHeader : undefined,
  };

  return (
    <Drawer.Navigator
      key={`drawer-${roleResolved ? (userRole ?? 'unknown') : 'pending'}`}
      initialRouteName={initialRoute}
      backBehavior="history"
      screenOptions={screenOptionsProps}
      drawerContent={drawerProps =>
        canUseDrawer ? <CustomDrawerContent {...drawerProps} /> : <View />
      }>
      {drawerData.map(stackItem => {
        const isAuthScreen =
          stackItem.name === 'Login' || stackItem.name === 'OnBoarding';

        const isRoleBlocked =
          !isAuthScreen &&
          roleResolved &&
          stackItem.allowedRoles &&
          userRole &&
          !stackItem.allowedRoles.includes(userRole);

        return (
          <Drawer.Screen
            key={stackItem.name}
            initialParams={stackItem.initialParams}
            name={stackItem.name}
            component={stackItem.component}
            options={{
              title: stackItem.title || stackItem.name,
              headerShown: canUseDrawer ? stackItem.isHeaderShown : false,
              drawerItemStyle:
                !canUseDrawer ||
                isAuthScreen ||
                isRoleBlocked ||
                stackItem.hideInDrawer
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
