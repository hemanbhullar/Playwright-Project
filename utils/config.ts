export const config = {
  baseURL: process.env.BASE_URL ?? 'https://www.scriptedqa.com',
  username: process.env.QA_USERNAME ?? 'admin',
  password: process.env.QA_PASSWORD ?? 'Pass@9211',
  headless: process.env.HEADLESS === 'true',
  actionTimeout: 15_000,
  navigationTimeout: 30_000,
  assertionTimeout: 15_000,
};
