const {spawnSync} = require('child_process');

const commands = [
  ['npm', ['run', 'lint']],
  ['npm', ['test', '--', '--watchAll=false']],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    console.error(`\nCommit blocked: ${command} ${args.join(' ')} failed.`);
    process.exit(result.status || 1);
  }
}
