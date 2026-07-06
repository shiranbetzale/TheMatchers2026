export type AppEnvironment = 'qa' | 'prod';

const QA_API_URL = 'https://thematchers-backend-qa.onrender.com';
const PROD_API_URL = 'https://thematchers-backend.onrender.com';

const normalizeEnvironment = (value?: string): AppEnvironment =>
  value === 'prod' ? 'prod' : 'qa';

export const APP_ENV: AppEnvironment = normalizeEnvironment(
  process.env.APP_ENV || process.env.NODE_ENV,
);

export const IS_PROD = APP_ENV === 'prod';
export const IS_QA = APP_ENV === 'qa';

export const API_BASE_URL = IS_PROD ? PROD_API_URL : QA_API_URL;

export const ENVIRONMENT_LABEL = IS_PROD ? 'Production' : 'QA';
