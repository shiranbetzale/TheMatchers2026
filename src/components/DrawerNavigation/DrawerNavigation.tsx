import React, {useEffect, useState} from 'react';
import {styles} from './DrawerNavigation.style';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerHeaderProps,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {Text, TouchableOpacity, View} from 'react-native';
import CustomMenu from '../CustomMenu/CustomMenu';
import CustomText from '../CustomText/CustomText';
import {FontsStyle} from '../../utils/FontsStyle';
import {CommonActions} from '@react-navigation/native';
import {getHeaderTitle} from '@react-navigation/elements';
import {drawerData} from '../../data/drawerData';
import {DrawerNavigationType} from './DrawerNavigation.type';
import {useLanguage} from '../../utils/LanguageProvider';
import MainScreen from '../../screens/MainScreen/MainScreen';
import {UserRole, clearSession, getSessionRole} from '../../services/session';
import MenuIcon from '../../assets/images/menu.svg';
import CardsIcon from '../../assets/images/cards.svg';
import CalendarIcon from '../../assets/images/datePicker.svg';
import ContactIcon from '../../assets/images/phone.svg';
import EditIcon from '../../assets/images/edit.svg';
import UserAddIcon from '../../assets/images/userAdd.svg';
import ArchiveIcon from '../../assets/images/orderBy.svg';
import LogoutIcon from '../../assets/images/logout.svg';

const Drawer = createDrawerNavigator();
const iconProps = {width: 18, height: 18};

const getDrawerIcon = (routeName: string) => {
  switch (routeName) {
    case 'Wizard':
      return <EditIcon {...iconProps} />;
    case 'AllCardsScreen':
    case 'AdminAllCardsScreen':
    case 'MatchmakerCardsScreen':
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
    case 'RegisterUserScreen':
      return <UserAddIcon {...iconProps} />;
    case 'HomeScreen':
    case 'MainScreen':
    default:
      return <MenuIcon {...iconProps} />;
  }
};

const DrawerHeader = ({navigation, route, options}: DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <CustomMenu
      title={title}
      isBackHidden={route.name === 'MainScreen'}
      onPressMenu={() => navigation.toggleDrawer()}
    />
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const {descriptors, navigation, state} = props;
  const {isRTL} = useLanguage();
  const visibleRoutes = state.routes.filter(route => {
    const descriptor = descriptors[route.key];
    const drawerItemStyle = descriptor?.options?.drawerItemStyle as
      | {display?: string}
      | undefined;
    return drawerItemStyle?.display !== 'none';
  });
  const logout = async () => {
    await clearSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerLogo}>
          <Text style={styles.drawerLogoText}>TM</Text>
        </View>
        <Text style={styles.drawerBrand}>TheMatchers</Text>
        <CustomText text="mainHeroSubtitle" customStyle={styles.drawerSubtitle} />
      </View>

      <View style={styles.drawerProfileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{isRTL ? 'ש' : 'S'}</Text>
        </View>
        <View style={styles.profileTextBlock}>
          <CustomText
            text="matchmakerShiranBetzalel"
            customStyle={styles.profileName}
          />
          <CustomText text="activeMatchmaker" customStyle={styles.profileRole} />
        </View>
      </View>

      <View style={styles.drawerSection}>
        {visibleRoutes.map(route => {
          const descriptor = descriptors[route.key];
          const labelKey = String(descriptor?.options?.title || route.name);
          const isFocused = state.routes[state.index]?.key === route.key;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.84}
              onPress={() => navigation.navigate(route.name)}
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
        <CustomText
          text="logout"
          customStyle={styles.logoutText}
        />
      </TouchableOpacity>
    </DrawerContentScrollView>
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
    drawerStyle: styles.drawerStyle,
    overlayColor: 'rgba(6, 26, 54, 0.42)',
    header: DrawerHeader,
  };

  return (
    <Drawer.Navigator
      initialRouteName={initialRoute}
      backBehavior="history"
      screenOptions={screenOptionsProps}
      drawerContent={drawerProps => <CustomDrawerContent {...drawerProps} />}>
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
              title: stackItem.title || stackItem.name,
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
