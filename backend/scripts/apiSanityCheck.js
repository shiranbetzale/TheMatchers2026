const DEFAULT_BASE_URL = 'https://thematchers-backend.onrender.com';

const baseUrl = String(process.env.API_BASE_URL || DEFAULT_BASE_URL).replace(
  /\/$/,
  '',
);
const shouldSendContactTest = process.argv.includes('--send-contact');

const checks = [
  {
    name: 'health',
    method: 'GET',
    path: '/health',
    expectedStatuses: [200],
  },
  {
    name: 'contact config',
    method: 'GET',
    path: '/api/contact/status',
    expectedStatuses: [200],
  },
  {
    name: 'contact validation',
    method: 'POST',
    path: '/api/contact',
    body: {},
    expectedStatuses: [400],
  },
  ...(shouldSendContactTest
    ? [
        {
          name: 'contact send',
          method: 'POST',
          path: '/api/contact',
          body: {
            name: 'API sanity check',
            email: 'sanity@example.com',
            phone: '0500000000',
            message: `API sanity check from ${new Date().toISOString()}`,
          },
          expectedStatuses: [200],
        },
      ]
    : []),
  {
    name: 'login validation',
    method: 'POST',
    path: '/auth/login',
    body: {},
    expectedStatuses: [400],
  },
  {
    name: 'candidate code validation',
    method: 'POST',
    path: '/auth/candidate/send-code',
    body: {},
    expectedStatuses: [400],
  },
  {
    name: 'profiles auth guard',
    method: 'GET',
    path: '/api/profiles',
    expectedStatuses: [401],
  },
  {
    name: 'users auth guard',
    method: 'GET',
    path: '/api/users/all',
    expectedStatuses: [401],
  },
  {
    name: 'matchmakers auth guard',
    method: 'GET',
    path: '/api/users/matchmakers',
    expectedStatuses: [401],
  },
  {
    name: 'matches auth guard',
    method: 'GET',
    path: '/api/matches',
    expectedStatuses: [401],
  },
  {
    name: 'notifications auth guard',
    method: 'POST',
    path: '/api/notifications/test',
    body: {},
    expectedStatuses: [401],
  },
  {
    name: 'uploads auth guard',
    method: 'POST',
    path: '/api/uploads/profile-images',
    expectedStatuses: [401],
  },
  {
    name: 'invitations claim validation',
    method: 'POST',
    path: '/api/invitations/claim',
    body: {},
    expectedStatuses: [400],
  },
];

async function runCheck(check) {
  const headers = {};
  const request = {
    method: check.method,
    headers,
  };

  if (check.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(check.body);
  }

  const response = await fetch(`${baseUrl}${check.path}`, request);
  const text = await response.text();
  let body;

  try {
    body = text ? JSON.parse(text) : null;
  } catch (_error) {
    body = text;
  }

  const passed = check.expectedStatuses.includes(response.status);

  return {
    ...check,
    passed,
    status: response.status,
    body,
  };
}

async function main() {
  console.log(`API sanity check: ${baseUrl}`);

  const results = [];

  for (const check of checks) {
    try {
      results.push(await runCheck(check));
    } catch (error) {
      results.push({
        ...check,
        passed: false,
        status: 'request_failed',
        body: error?.message || String(error),
      });
    }
  }

  results.forEach(result => {
    const icon = result.passed ? 'OK' : 'FAIL';
    const expected = result.expectedStatuses.join('/');

    console.log(
      `${icon} ${result.name} ${result.method} ${result.path} -> ${result.status} expected ${expected}`,
    );

    if (!result.passed) {
      console.log(JSON.stringify(result.body, null, 2));
    }
  });

  const failed = results.filter(result => !result.passed);

  if (failed.length) {
    process.exitCode = 1;
  }
}

main();
