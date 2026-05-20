#!/usr/bin/env node

const { loadConfigAsync } = require('@react-native-community/cli');
const configCommand = require('@react-native-community/cli-config/build/commands/config').default;

loadConfigAsync({ selectedPlatform: 'ios' })
  .then(config => configCommand.func([], config, {}))
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
