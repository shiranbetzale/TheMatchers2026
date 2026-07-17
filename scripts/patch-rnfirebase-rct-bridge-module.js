const fs = require('fs');
const path = require('path');

const firebaseRoot = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native-firebase',
);

const importLine = '#import <React/RCTBridgeModule.h>';
const exportMacroPattern = /\bRCT_EXPORT_(?:MODULE|METHOD|BLOCKING_SYNCHRONOUS_METHOD)\b/;

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(firebaseRoot)) {
  console.log('[patch-rnfirebase] React Native Firebase is not installed; skipping.');
  process.exit(0);
}

let patchedCount = 0;

for (const filePath of walk(firebaseRoot)) {
  if (!filePath.endsWith('.m')) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  if (!exportMacroPattern.test(source) || source.includes(importLine)) {
    continue;
  }

  const lines = source.split('\n');
  const lastImportIndex = lines.reduce(
    (lastIndex, line, index) => (/^\s*#(?:import|include)\s+/.test(line) ? index : lastIndex),
    -1,
  );

  if (lastImportIndex === -1) {
    console.warn(`[patch-rnfirebase] No import section found in ${filePath}; skipping.`);
    continue;
  }

  lines.splice(lastImportIndex + 1, 0, importLine);
  fs.writeFileSync(filePath, lines.join('\n'));
  patchedCount += 1;
}

console.log(
  `[patch-rnfirebase] Added the direct RCTBridgeModule import to ${patchedCount} Firebase Objective-C file(s).`,
);
