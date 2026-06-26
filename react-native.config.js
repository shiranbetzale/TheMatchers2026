module.exports = {
  reactNativePath: './node_modules/react-native',
  assets: ['./src/assets/fonts'],
  project: {
    ios: {
      sourceDir: './ios',
      automaticPodsInstallation: false,
    },
  },
  codegen: {
    disable: true,
  },
};
