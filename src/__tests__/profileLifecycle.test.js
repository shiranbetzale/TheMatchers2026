const http = require('http');
const express = require('express');

let profiles = [];
let nextId = 1;

jest.mock('../../backend/middleware/auth', () => ({
  requireAuth: () => (req, _res, next) => {
    req.user = {
      id: 'matchmaker-e2e',
      role: 'admin',
      fullName: 'E2E Matchmaker',
      phone: '0500000001',
      email: 'e2e@example.com',
    };
    next();
  },
}));

jest.mock('../../backend/services/pushNotifications', () => ({
  notifyProfileCreated: jest.fn(async () => ({successCount: 1, failureCount: 0})),
  notifyProfileRelationshipStatus: jest.fn(async () => ({
    successCount: 1,
    failureCount: 0,
  })),
}));

jest.mock('../../backend/models/User', () => ({
  find: jest.fn(async () => [
    {
      id: 'matchmaker-e2e',
      fullName: 'E2E Matchmaker',
      phone: '0500000001',
      email: 'e2e@example.com',
    },
  ]),
}));

jest.mock('../../backend/models/Profile', () => {
  class MockProfile {
    constructor(values = {}) {
      Object.assign(this, values);
      this.id = String(values.id || values._id || nextId++);
      this._id = this.id;
      this.createdAt = values.createdAt || new Date().toISOString();
      this.status = values.status || 'active';
      this.relationshipStatus = values.relationshipStatus || '';
      this.partnerName = values.partnerName || '';
      this.partnerProfileId = values.partnerProfileId || '';
      this.partnerOutsideApp = Boolean(values.partnerOutsideApp);
      this.collaborationMatchmaker = values.collaborationMatchmaker || '';
      this.images = Array.isArray(values.images) ? values.images : [];
    }

    async save() {
      const index = profiles.findIndex(item => String(item.id) === String(this.id));
      if (index >= 0) {
        profiles[index] = this;
      } else {
        profiles.push(this);
      }
      return this;
    }

    toJSON() {
      return {...this};
    }
  }

  MockProfile.create = jest.fn(async values => {
    const profile = new MockProfile(values);
    await profile.save();
    return profile;
  });
  MockProfile.find = jest.fn(async query => {
    const entries = Object.entries(query || {});
    return profiles.filter(profile =>
      entries.every(([key, value]) => String(profile[key] || '') === String(value)),
    );
  });
  MockProfile.findById = jest.fn(async id =>
    profiles.find(profile => String(profile.id) === String(id)) || null,
  );

  return MockProfile;
});

const profilesRouter = require('../../backend/routes/profiles');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/profiles', profilesRouter);
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({
      error: error.message,
      field: error.field,
    });
  });
  return app;
}

function request(app, method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const payload = body === undefined ? '' : JSON.stringify(body);
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: address.port,
          path,
          method,
          headers: payload
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
              }
            : undefined,
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
      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

const candidate = (fullName, phone, gender) => ({
  fullName,
  phone,
  gender,
  city: 'בני ברק',
  age: gender === 'male' ? 30 : 27,
  status: 'active',
  relationshipStatus: '',
});

describe('candidate lifecycle: create, match, archive and restore', () => {
  beforeEach(() => {
    profiles = [];
    nextId = 1;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('creates a candidate and returns it in the active cards list', async () => {
    const app = createApp();
    const created = await request(
      app,
      'POST',
      '/api/profiles',
      candidate('משודך בדיקה', '0500000010', 'male'),
    );

    expect(created.status).toBe(201);
    expect(created.body.profile).toMatchObject({
      fullName: 'משודך בדיקה',
      phone: '0500000010',
      status: 'active',
      assignedMatchmaker: 'matchmaker-e2e',
    });

    const active = await request(app, 'GET', '/api/profiles');
    expect(active.status).toBe(200);
    expect(active.body.profiles).toHaveLength(1);
    expect(active.body.profiles[0].fullName).toBe('משודך בדיקה');
  });

  test('creates a match and archives both matched candidates', async () => {
    const app = createApp();
    const male = await request(
      app,
      'POST',
      '/api/profiles',
      candidate('חתן בדיקה', '0500000011', 'male'),
    );
    const female = await request(
      app,
      'POST',
      '/api/profiles',
      candidate('כלה בדיקה', '0500000012', 'female'),
    );

    const maleId = male.body.profile.id;
    const femaleId = female.body.profile.id;

    const matched = await request(app, 'PUT', `/api/profiles/${maleId}`, {
      relationshipStatus: 'engaged',
      partnerName: 'כלה בדיקה',
      partnerProfileId: femaleId,
      partnerOutsideApp: false,
    });

    expect(matched.status).toBe(200);
    expect(matched.body.profile).toMatchObject({
      status: 'archived',
      archivedReason: 'engaged',
      relationshipStatus: 'engaged',
      partnerName: 'כלה בדיקה',
      partnerProfileId: femaleId,
    });

    const archived = await request(
      app,
      'GET',
      '/api/profiles?status=archived',
    );
    expect(archived.status).toBe(200);
    expect(archived.body.profiles).toHaveLength(2);

    const archivedMale = archived.body.profiles.find(
      item => item.phone === '0500000011',
    );
    const archivedFemale = archived.body.profiles.find(
      item => item.phone === '0500000012',
    );

    expect(archivedMale).toMatchObject({
      relationshipStatus: 'engaged',
      partnerName: 'כלה בדיקה',
    });
    expect(archivedFemale).toMatchObject({
      status: 'archived',
      relationshipStatus: 'engaged',
      partnerName: 'חתן בדיקה',
      partnerProfileId: maleId,
    });
  });

  test('restores an archived candidate to the active list and clears match data', async () => {
    const app = createApp();
    const created = await request(
      app,
      'POST',
      '/api/profiles',
      candidate('משודך לשחזור', '0500000013', 'male'),
    );
    const profileId = created.body.profile.id;

    const archived = await request(
      app,
      'POST',
      `/api/profiles/${profileId}/archive`,
      {reason: 'married'},
    );
    expect(archived.status).toBe(200);
    expect(archived.body.profile).toMatchObject({
      status: 'archived',
      relationshipStatus: 'married',
    });

    const restored = await request(app, 'PUT', `/api/profiles/${profileId}`, {
      status: 'active',
      relationshipStatus: '',
      archivedReason: '',
      partnerName: '',
      partnerProfileId: '',
      partnerOutsideApp: false,
      collaborationMatchmaker: '',
    });

    expect(restored.status).toBe(200);
    expect(restored.body.profile).toMatchObject({
      status: 'active',
      relationshipStatus: '',
      archivedReason: '',
      partnerName: '',
      partnerProfileId: '',
      partnerOutsideApp: false,
    });

    const active = await request(app, 'GET', '/api/profiles');
    expect(active.body.profiles.map(item => item.phone)).toContain('0500000013');

    const archive = await request(
      app,
      'GET',
      '/api/profiles?status=archived',
    );
    expect(archive.body.profiles.map(item => item.phone)).not.toContain(
      '0500000013',
    );
  });

  test('rejects creation when candidate name or phone is missing', async () => {
    const app = createApp();
    const missingName = await request(app, 'POST', '/api/profiles', {
      phone: '0500000014',
    });
    const missingPhone = await request(app, 'POST', '/api/profiles', {
      fullName: 'ללא טלפון',
    });

    expect(missingName.status).toBe(400);
    expect(missingName.body.field).toBe('fullName');
    expect(missingPhone.status).toBe(400);
    expect(missingPhone.body.field).toBe('phone');
  });
});
