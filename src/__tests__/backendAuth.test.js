const crypto = require('crypto');
const http = require('http');
const express = require('express');

const mockVerifyIdToken = jest.fn();
let mockUsers = [];

jest.mock('../../backend/config/firebase', () => ({
  admin: {
    auth: () => ({verifyIdToken: mockVerifyIdToken}),
  },
}));

jest.mock('../../backend/models/User', () => {
  class MockUser {
    constructor(values) {
      Object.assign(this, values);
      this.id = values.id || 'new-user-id';
    }

    async save() {
      mockUsers.push(this);
      return this;
    }
  }

  MockUser.find = jest.fn(async () => mockUsers);
  MockUser._fromSnapshot = jest.fn(snapshot => snapshot.user);
  MockUser.collection = {
    where: jest.fn((field, operator, value) => ({
      get: jest.fn(async () => {
        const values = operator === 'in' ? value : [value];
        return {
          docs: mockUsers
            .filter(user => values.includes(user[field]))
            .map(user => ({user})),
        };
      }),
    })),
  };

  return MockUser;
});

const authRouter = require('../../backend/routes/auth');

function createPasswordHash(password, salt = '0123456789abcdef0123456789abcdef') {
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return `${salt}:${hash}`;
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({
      error: error.message,
    });
  });
  return app;
}

function request(app, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const payload = JSON.stringify(body || {});
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: address.port,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        res => {
          let raw = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            raw += chunk;
          });
          res.on('end', () => {
            server.close();
            resolve({
              status: res.statusCode,
              body: raw ? JSON.parse(raw) : null,
            });
          });
        },
      );

      req.on('error', error => {
        server.close();
        reject(error);
      });
      req.write(payload);
      req.end();
    });
  });
}

function matchmaker(overrides = {}) {
  return {
    id: 'matchmaker-1',
    fullName: 'Test Matchmaker',
    phone: '0501234567',
    email: 'matchmaker@example.com',
    role: 'matchmaker',
    isActive: true,
    passwordHash: createPasswordHash('secret123'),
    ...overrides,
  };
}

describe('backend authentication flows', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalFetch = global.fetch;

  beforeAll(() => {
    process.env.JWT_SECRET = 'unit-test-secret';
  });

  beforeEach(() => {
    mockUsers = [];
    mockVerifyIdToken.mockReset();
    global.fetch = originalFetch;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
    global.fetch = originalFetch;
  });

  describe('POST /auth/login', () => {
    test('logs an active matchmaker in and returns a token', async () => {
      mockUsers = [matchmaker()];

      const response = await request(createApp(), '/auth/login', {
        phone: '050-123-4567',
        password: 'secret123',
      });

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        id: 'matchmaker-1',
        phone: '0501234567',
        role: 'matchmaker',
        isActive: true,
      });
      expect(response.body.token).toEqual(expect.any(String));
    });

    test('rejects an incorrect password', async () => {
      mockUsers = [matchmaker()];

      const response = await request(createApp(), '/auth/login', {
        phone: '0501234567',
        password: 'wrong-password',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('invalid credentials');
    });

    test('rejects an inactive matchmaker', async () => {
      mockUsers = [matchmaker({isActive: false})];

      const response = await request(createApp(), '/auth/login', {
        phone: '0501234567',
        password: 'secret123',
      });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('user is inactive');
    });

    test('validates required login fields', async () => {
      const response = await request(createApp(), '/auth/login', {
        phone: '0501234567',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('phone, password are required');
    });
  });

  describe('POST /auth/candidate/send-code', () => {
    test('accepts an active matchmaker and normalizes phone numbers', async () => {
      mockUsers = [matchmaker()];

      const response = await request(createApp(), '/auth/candidate/send-code', {
        phone: '052-111-2233',
        matchmakerPhone: '+972 50-123-4567',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        phone: '0521112233',
        matchmakerPhone: '972501234567',
        channel: 'firebase',
      });
    });

    test.each([
      ['missing', []],
      ['inactive', [matchmaker({isActive: false})]],
      ['wrong role', [matchmaker({role: 'user'})]],
    ])('rejects a %s matchmaker', async (_label, users) => {
      mockUsers = users;

      const response = await request(createApp(), '/auth/candidate/send-code', {
        phone: '0521112233',
        matchmakerPhone: '0501234567',
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('matchmaker not found');
    });
  });

  describe('POST /auth/candidate/verify-firebase', () => {
    test('returns a candidate token when Firebase verified the same phone', async () => {
      mockUsers = [matchmaker()];
      mockVerifyIdToken.mockResolvedValue({phone_number: '+972521112233'});

      const response = await request(
        createApp(),
        '/auth/candidate/verify-firebase',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
          firebaseIdToken: 'valid-firebase-token',
        },
      );

      expect(response.status).toBe(200);
      expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
      expect(response.body.user).toMatchObject({
        id: 'matchmaker-1',
        phone: '0521112233',
        role: 'user',
        matchmakerPhone: '0501234567',
      });
      expect(response.body.nextScreen).toBe('Wizard');
      expect(response.body.token).toEqual(expect.any(String));
    });

    test('rejects an invalid Firebase token', async () => {
      mockUsers = [matchmaker()];
      mockVerifyIdToken.mockRejectedValue(new Error('invalid token'));

      const response = await request(
        createApp(),
        '/auth/candidate/verify-firebase',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
          firebaseIdToken: 'invalid-token',
        },
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('invalid firebase token');
    });

    test('rejects a token verified for a different phone', async () => {
      mockUsers = [matchmaker()];
      mockVerifyIdToken.mockResolvedValue({phone_number: '+972529999999'});

      const response = await request(
        createApp(),
        '/auth/candidate/verify-firebase',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
          firebaseIdToken: 'valid-but-wrong-user',
        },
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('phone mismatch');
    });
  });

  describe('voice verification', () => {
    test('requests a phone call through Twilio Verify', async () => {
      mockUsers = [matchmaker()];
      process.env.TWILIO_ACCOUNT_SID = 'AC-test';
      process.env.TWILIO_AUTH_TOKEN = 'token-test';
      process.env.TWILIO_VERIFY_SERVICE_SID = 'VA-test';
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({status: 'pending'}),
      });

      const response = await request(
        createApp(),
        '/auth/candidate/send-voice-code',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
        },
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ok: true, channel: 'call'});
      expect(global.fetch).toHaveBeenCalledWith(
        'https://verify.twilio.com/v2/Services/VA-test/Verifications',
        expect.objectContaining({method: 'POST'}),
      );
      const requestOptions = global.fetch.mock.calls[0][1];
      expect(requestOptions.body.get('To')).toBe('+972521112233');
      expect(requestOptions.body.get('Channel')).toBe('call');
    });

    test('approves a correct voice code and returns a candidate token', async () => {
      mockUsers = [matchmaker()];
      process.env.TWILIO_ACCOUNT_SID = 'AC-test';
      process.env.TWILIO_AUTH_TOKEN = 'token-test';
      process.env.TWILIO_VERIFY_SERVICE_SID = 'VA-test';
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({status: 'approved'}),
      });

      const response = await request(
        createApp(),
        '/auth/candidate/verify-voice-code',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
          code: '12-34-56',
        },
      );

      expect(response.status).toBe(200);
      expect(response.body.nextScreen).toBe('Wizard');
      expect(response.body.token).toEqual(expect.any(String));
      const requestOptions = global.fetch.mock.calls[0][1];
      expect(requestOptions.body.get('Code')).toBe('123456');
    });

    test('rejects a voice code that Twilio did not approve', async () => {
      mockUsers = [matchmaker()];
      process.env.TWILIO_ACCOUNT_SID = 'AC-test';
      process.env.TWILIO_AUTH_TOKEN = 'token-test';
      process.env.TWILIO_VERIFY_SERVICE_SID = 'VA-test';
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({status: 'pending'}),
      });

      const response = await request(
        createApp(),
        '/auth/candidate/verify-voice-code',
        {
          phone: '0521112233',
          matchmakerPhone: '0501234567',
          code: '000000',
        },
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('invalid candidate code');
    });
  });

  describe('legacy candidate code endpoint', () => {
    test('rejects a code that does not equal the matchmaker phone', async () => {
      mockUsers = [matchmaker()];

      const response = await request(createApp(), '/auth/candidate/verify-code', {
        phone: '0521112233',
        matchmakerPhone: '0501234567',
        code: '123456',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('invalid candidate code');
    });
  });
});
