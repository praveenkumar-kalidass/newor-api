jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail: jest.fn() }),
}));
