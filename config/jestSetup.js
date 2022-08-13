jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: jest.fn() }),
}));

jest.mock('.', () => {
  const appConfig = jest.requireActual('./config.test.json');
  return {
    databaseConfig: {},
    appConfig,
  };
});

jest.mock('../src/helper/logger', () => ({
  init: () => ({
    context: {},
    // eslint-disable-next-line no-console
    info: console.log,
    // eslint-disable-next-line no-console
    error: console.error,
    end: jest.fn(),
  }),
}));

jest.mock('../src/helper/oauth', () => ({
  authorize: jest.fn(),
  authenticate: jest.fn(),
  token: jest.fn(),
}));

jest.mock('../src/helper/token', () => ({
  getUser: jest.fn(),
  getAccessToken: jest.fn(),
}));
