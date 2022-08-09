jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: jest.fn() }),
}));

jest.mock('.', () => ({
  getDatabaseConfig: jest.fn(),
  getAppConfig: jest.fn(() => ({
    baseURL: 'http://localhost:3000',
    emailVerificationTokenSecret: 'test_secret',
    smtpEndpoint: 'smtp.test.com',
    smtpUsername: 'qwerty123',
    smtpPassword: 'password',
    emailId: 'test@test.com',
    passwordResetTokenSecret: 'test_secret',
  })),
}));

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
