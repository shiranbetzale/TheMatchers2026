const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-navigation',
  'elements',
  'lib',
  'module',
  'types.js',
);

if (!fs.existsSync(path.dirname(targetFile))) {
  console.log('React Navigation Elements module folder not found, skipping patch');
  process.exit(0);
}

if (!fs.existsSync(targetFile)) {
  fs.writeFileSync(
    targetFile,
    '// Runtime stub generated because @react-navigation/elements exports types.js.\n',
  );
  console.log('Patched @react-navigation/elements missing lib/module/types.js');
} else {
  console.log('@react-navigation/elements lib/module/types.js already exists');
}
