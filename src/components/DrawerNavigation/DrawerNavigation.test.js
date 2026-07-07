const React = require('react');

const getSessionRole = jest.fn();
const getSessionUser = jest.fn();
const clearSession = jest.fn(() => Promise.resolve());

const DummyScreen = () => React.createElement('DummyScreen');
let navigatorProps;
let screenProps = [];

jest.mock('react-native', () => ({
  Text: ({children, ...props}) => React.createElement('Text', props, children),
  View: ({children, ...props}) => React.createElement('View', props, children),
  StyleSheet: {
    create: styles => styles,
  },
}));

const deviceInfoMock = {
  getSystemName: jest.fn(() => 'iOS'),
  getSystemVersion: jest.fn(() => '17'),
  hasNotch: jest.fn(() => false),
  isTablet: jest.fn(() => false),
};

jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: deviceInfoMock,
  ...deviceInfoMock,
}));

jest.mock('@react-navigation/drawer', () => {
  const React = require('react');

  const Drawer = {
    Navigator: props => {
      navigatorProps = props;
      return React.createElement('DrawerNavigator', props, props.children);
    },
    Screen: props => {
      screenProps.push(props);
      return React.createElement('DrawerScreen', props);
    },
  };

  return {
    createDrawerNavigator: jest.fn(() => Drawer),
    DrawerContentScrollView: ({children, ...props}) =>
      React.createElement('DrawerContentScrollView', props, children),
  };
});

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    reset: jest.fn(payload => ({type: 'RESET', payload})),
  },
  useFocusEffect: jest.fn(),
}));

jest.mock('../../services/session', () => ({
  getSessionRole,
  getSessionUser,
  clearSession,
}));

jest.mock('../../utils/LanguageProvider', () => ({
  useLanguage: jest.fn(() => ({isRTL: false})),
}));

jest.mock('../../data/drawerData', () => ({
  drawerData: [
    {name: 'Login', title: 'login', component: DummyScreen, isHeaderShown: false},
    {
      name: 'MainScreen',
      title: 'main',
      component: DummyScreen,
      isHeaderShown: true,
      allowedRoles: ['admin', 'matchmaker'],
    },
    {
      name: 'Wizard',
      title: 'wizard',
      component: DummyScreen,
      isHeaderShown: true,
      allowedRoles: ['admin', 'matchmaker', 'user'],
      initialParams: {mode: 'create'},
    },
    {
      name: 'AllCardsScreen',
      title: 'allCards',
      component: DummyScreen,
      isHeaderShown: true,
      allowedRoles: ['admin', 'matchmaker'],
    },
    {
      name: 'HiddenScreen',
      title: 'hidden',
      component: DummyScreen,
      isHeaderShown: true,
      hideInDrawer: true,
    },
  ],
}));

jest.mock('../CustomButton/CustomButton', () => {
  const React = require('react');
  const CustomButton = ({children, onPress, ...props}) =>
    React.createElement('CustomButton', {...props, onPress}, children);

  return {
    __esModule: true,
    default: CustomButton,
    BUTTON_ICON_SIZE: 18,
  };
});

jest.mock('../CustomMenu/CustomMenu', () => {
  const React = require('react');

  return ({onPressMenu, ...props}) =>
    React.createElement('CustomMenu', {...props, onPressMenu});
});

jest.mock('../CustomText/CustomText', () => {
  const React = require('react');

  return ({text, customStyle}) =>
    React.createElement('CustomText', {text, customStyle}, text);
});

const DrawerNavigation = require('./DrawerNavigation').default;

describe('DrawerNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navigatorProps = undefined;
    screenProps = [];
  });

  it('is importable as a React component', () => {
    expect(typeof DrawerNavigation).toBe('function');
  });

  it('registers the drawer navigation module dependencies', () => {
    const drawer = require('@react-navigation/drawer');
    const session = require('../../services/session');

    expect(drawer.createDrawerNavigator).toHaveBeenCalledTimes(1);
    expect(session.clearSession).toBe(clearSession);
    expect(session.getSessionRole).toBe(getSessionRole);
    expect(session.getSessionUser).toBe(getSessionUser);
  });
});
