#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-date-picker',
  'package.json',
);

if (!fs.existsSync(packageJsonPath)) {
  process.exit(0);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const iosConfig = packageJson.codegenConfig?.ios;

if (iosConfig?.modulesProvider) {
  delete iosConfig.modulesProvider;
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
}
