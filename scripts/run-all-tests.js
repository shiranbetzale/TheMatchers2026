const {spawn, spawnSync} = require('child_process');
const net = require('net');

const platformArg = process.argv[2] || process.env.E2E_PLATFORM || 'android';
const platform = String(platformArg).toLowerCase();

if (!['android', 'ios'].includes(platform)) {
  console.error(`Unsupported platform: ${platform}. Use android or ios.`);
  process.exit(1);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
let metroProcess = null;

function run(script) {
  const result = spawnSync(npmCommand, ['run', script], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function isPortOpen(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({host: '127.0.0.1', port});
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForMetro(timeoutMs = 60000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isPortOpen(8081)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Metro did not start on port 8081 within 60 seconds.');
}

async function ensureMetro() {
  if (await isPortOpen(8081)) {
    console.log('Metro is already running on port 8081.');
    return;
  }

  console.log('Starting Metro...');
  metroProcess = spawn(npmCommand, ['start', '--', '--reset-cache'], {
    stdio: 'inherit',
    env: process.env,
    detached: process.platform !== 'win32',
  });

  await waitForMetro();
}

function stopMetro() {
  if (!metroProcess || metroProcess.killed) {
    return;
  }

  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(metroProcess.pid), '/T', '/F']);
    } else {
      process.kill(-metroProcess.pid, 'SIGTERM');
    }
  } catch (_error) {
    metroProcess.kill('SIGTERM');
  }
}

async function main() {
  console.log(`Running all automated tests for ${platform}...`);

  run('lint');
  run('test:ci');
  await ensureMetro();
  run(`e2e:build:${platform}`);
  run(`e2e:test:${platform}`);

  console.log(`All automated tests passed for ${platform}.`);
}

process.on('SIGINT', () => {
  stopMetro();
  process.exit(130);
});
process.on('SIGTERM', () => {
  stopMetro();
  process.exit(143);
});

main()
  .catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(stopMetro);
