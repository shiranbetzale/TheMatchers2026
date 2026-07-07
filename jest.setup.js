global.__DEV__ = true;

jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');

  return {
    View: ({children, ...props}) => React.createElement('View', props, children),
    createAnimatedComponent: component => component,
    default: {
      View: ({children, ...props}) => React.createElement('View', props, children),
      createAnimatedComponent: component => component,
    },
  };
});
