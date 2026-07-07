const React = require('react');
const renderer = require('react-test-renderer');
const {act} = renderer;

const getSessionRole = jest.fn();
const getSessionUser = jest.fn();
const clearSession = jest.fn(() => Promise.resolve());
const navigate = jest.fn();
const dispatch = jest.fn();

const DummyScreen = () => React.createElement('DummyScreen');

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
    Navigator: ({children, drawerContent, ...props}) =>
      React.createElement(
        'DrawerNavigator',
        {...props, drawerContent},
        children,
      ),
    Screen: props => React.createElement('DrawerScreen', props),
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
  useFocusEffect: callback => {
    React.useEffect(() => callback(), [callback]);
  },
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

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const renderDrawer = async role => {
  getSessionRole.mockResolvedValue(role);
  getSessionUser.mockResolvedValue({name: 'Shiran'});

  let tree;
  await act(async () => {
    tree = renderer.create(
      React.createElement(DrawerNavigation, {initialRoute: 'MainScreen'}),
    );
    await flushPromises();
  });

  return tree;
};

describe('DrawerNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables the drawer for admin and matchmaker roles', async () => {
    const tree = await renderDrawer('admin');
    const drawer = tree.root.findByType('DrawerNavigator');

    expect(drawer.props.initialRouteName).toBe('MainScreen');
    expect(drawer.props.screenOptions.swipeEnabled).toBe(true);
    expect(drawer.props.screenOptions.headerShown).toBe(true);
    expect(drawer.props.screenOptions.drawerPosition).toBe('left');
  });

  it('hides drawer UI for candidate user role while keeping allowed user screens mounted', async () => {
    const tree = await renderDrawer('user');
    const drawer = tree.root.findByType('DrawerNavigator');
    const screens = tree.root.findAllByType('DrawerScreen');
    const wizard = screens.find(screen => screen.props.name === 'Wizard');
    const allCards = screens.find(screen => screen.props.name === 'AllCardsScreen');

    expect(drawer.props.screenOptions.swipeEnabled).toBe(false);
    expect(drawer.props.screenOptions.headerShown).toBe(false);
    expect(wizard.props.options.drawerItemStyle).toEqual({display: 'none'});
    expect(allCards.props.options.drawerItemStyle).toEqual({display: 'none'});
  });

  it('clears the session and resets to Login from the custom drawer logout action', async () => {
    getSessionRole.mockResolvedValue('admin');
    getSessionUser.mockResolvedValue({name: 'Shiran'});

    const props = {
      descriptors: {main: {options: {title: 'main'}}},
      navigation: {navigate, dispatch},
      state: {index: 0, routes: [{key: 'main', name: 'MainScreen'}]},
    };

    let tree;
    await act(async () => {
      tree = renderer.create(
        React.createElement(DrawerNavigation, {initialRoute: 'MainScreen'}),
      );
      await flushPromises();
    });

    const drawer = tree.root.findByType('DrawerNavigator');
    let drawerContent;
    await act(async () => {
      drawerContent = renderer.create(drawer.props.drawerContent(props));
      await flushPromises();
    });

    const buttons = drawerContent.root.findAllByType('CustomButton');
    const logoutButton = buttons[buttons.length - 1];

    await act(async () => {
      await logoutButton.props.onPress();
    });

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESET',
      payload: {
        index: 0,
        routes: [{name: 'Login'}],
      },
    });
  });
});
