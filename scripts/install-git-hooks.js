const fs = require('fs');
const path = require('path');

const gitDir = path.resolve(__dirname, '..', '.git');
const hooksDir = path.join(gitDir, 'hooks');
const preCommitPath = path.join(hooksDir, 'pre-commit');

if (!fs.existsSync(gitDir)) {
  process.exit(0);
}

fs.mkdirSync(hooksDir, {recursive: true});
fs.writeFileSync(
  preCommitPath,
  '#!/bin/sh\nnode scripts/run-tests-before-commit.js\n',
  'utf8',
);
fs.chmodSync(preCommitPath, 0o755);

console.log('Installed pre-commit hook: lint + test must pass before commit.');
