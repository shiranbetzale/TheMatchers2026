describe('environment config', () => {
  const originalEnv = process.env.APP_ENV;

  afterEach(() => {
    jest.resetModules();
    process.env.APP_ENV = originalEnv;
  });

  it('uses QA by default', () => {
    delete process.env.APP_ENV;

    const config = require('../src/config/environment');

    expect(config.APP_ENV).toBe('qa');
    expect(config.IS_QA).toBe(true);
    expect(config.IS_PROD).toBe(false);
    expect(config.API_BASE_URL).toBe('https://thematchers-backend-qa.onrender.com');
  });

  it('uses production when APP_ENV is prod', () => {
    process.env.APP_ENV = 'prod';

    const config = require('../src/config/environment');

    expect(config.APP_ENV).toBe('prod');
    expect(config.IS_PROD).toBe(true);
    expect(config.API_BASE_URL).toBe('https://thematchers-backend.onrender.com');
  });

  it('falls back to QA for unknown APP_ENV values', () => {
    process.env.APP_ENV = 'staging';

    const config = require('../src/config/environment');

    expect(config.APP_ENV).toBe('qa');
    expect(config.API_BASE_URL).toBe('https://thematchers-backend-qa.onrender.com');
  });
});
