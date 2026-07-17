const {spawnSync} = require('child_process');

const platform = process.argv[2] || 'all';
const supported = new Set(['android', 'ios', 'all']);

if (!supported.has(platform)) {
  console.error('Usage: node scripts/run-release-check.js [android|ios|all]');
  process.exit(1);
}

const run = (command, args) => {
  console.log(`\n▶ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {...process.env, APP_ENV: 'prod'},
  });

  if (result.status !== 0) {
    console.error(`\n❌ Release check failed: ${command} ${args.join(' ')}`);
    process.exit(result.status || 1);
  }
};

run('npm', ['run', 'lint']);
run('npm', ['test', '--', '--watchAll=false', '--runInBand']);

if (platform === 'android' || platform === 'all') {
  run('npm', ['run', 'build:android:prod']);
}

if (platform === 'ios' || platform === 'all') {
  if (process.platform !== 'darwin') {
    console.error('\n❌ iOS release validation requires macOS with Xcode installed.');
    process.exit(1);
  }

  run('bash', [
    '-lc',
    'cd ios && pod install && xcodebuild -workspace TheMatchers.xcworkspace -scheme TheMatchers -configuration Release -sdk iphonesimulator -derivedDataPath build/release-check CODE_SIGNING_ALLOWED=NO build',
  ]);
}

console.log('\n✅ Release check passed. The code, automated tests, and requested production build(s) completed successfully.');
console.log('⚠️ Real-device SMS, voice call, push notifications, and store signing still require manual validation.');
