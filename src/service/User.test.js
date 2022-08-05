const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const userService = require('./User');
const userDao = require('../dao/User');
const mailer = require('../helper/mailer');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));
jest.mock('../dao/User', () => ({
  save: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
}));
jest.mock('../helper/template', () => ({
  getVerificationMail: (data) => data,
  getVerificationStatus: (data) => data,
  getPasswordResetMail: (data) => data,
}));

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should successfully signup user', async () => {
      const expectedResponse = { id: 1, username: 'Test', password: 'password' };
      userDao.save.mockResolvedValueOnce(expectedResponse);
      mailer.sendMail.mockResolvedValueOnce();

      await expect(userService.signup({ username: 'Test', password: 'test@123' })).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw error when signup user', async () => {
      userDao.save.mockRejectedValueOnce(Error('User error'));

      await expect(userService.signup({ username: 'Test', password: 'test@123' })).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });
  });

  describe('login', () => {
    it('should successfully login user', async () => {
      const expectedResponse = { email: 'test@test.com', password: passwordHash.generate('test@123'), isVerified: true };
      userDao.fetch.mockResolvedValueOnce(expectedResponse);

      await expect(userService.login({ email: 'test@test.com', password: 'test@123' })).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw user not found error', async () => {
      userDao.fetch.mockResolvedValueOnce(null);

      await expect(userService.login({ email: 'test@test.com', password: 'test' })).rejects.toStrictEqual({
        status: 404,
        data: {
          code: 'NEWOR_USER_NOT_FOUND',
          description: 'User not found.',
        },
      });
    });

    it('should throw email not verified error', async () => {
      const expectedResponse = { email: 'test@test.com', password: passwordHash.generate('test@123'), isVerified: false };
      userDao.fetch.mockResolvedValueOnce(expectedResponse);

      await expect(userService.login({ email: 'test@test.com', password: 'test' })).rejects.toStrictEqual({
        status: 403,
        data: {
          code: 'NEWOR_EMAIL_NOT_VERIFIED',
          description: 'Email verification incomplete.',
        },
      });
    });

    it('should throw invalid credentials error', async () => {
      const expectedResponse = { email: 'test@test.com', password: passwordHash.generate('test@123'), isVerified: true };
      userDao.fetch.mockResolvedValueOnce(expectedResponse);

      await expect(userService.login({ email: 'test@test.com', password: 'test' })).rejects.toStrictEqual({
        status: 401,
        data: {
          code: 'NEWOR_INVALID_CREDENTIALS',
          description: 'Invalid credentials.',
        },
      });
    });

    it('should throw error when login user', async () => {
      userDao.fetch.mockRejectedValueOnce(Error('User error'));

      await expect(userService.login({ email: 'test@test.com', password: 'test@123' })).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });
  });

  describe('verify', () => {
    it('should return failure template when token verification fails', async () => {
      jwt.verify.mockReturnValueOnce(false);

      await expect(userService.verify('testtoken123')).rejects.toStrictEqual({
        status: 401,
        data: {
          code: 'NEWOR_INVALID_CREDENTIALS',
          description: 'Invalid credentials.',
        },
      });
    });

    it('should return failure template when user data mismatch', async () => {
      jwt.verify.mockReturnValueOnce(true);
      jwt.decode.mockReturnValueOnce({ id: 'testuserid' });
      userDao.fetch.mockResolvedValueOnce(null);

      await expect(userService.verify('testtoken123')).rejects.toStrictEqual({
        status: 404,
        data: {
          code: 'NEWOR_USER_NOT_FOUND',
          description: 'User not found.',
        },
      });
    });

    it('should return success template when token matches', async () => {
      jwt.verify.mockReturnValueOnce(true);
      jwt.decode.mockReturnValueOnce({ id: 'testuserid' });
      userDao.fetch.mockResolvedValueOnce({ id: 'testuserid' });
      userDao.update.mockResolvedValueOnce({ id: 'testuserid', isVerified: true });

      await expect(userService.verify('testtoken123')).resolves.toStrictEqual({
        id: 'testuserid',
        isVerified: true,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should successfully complete forgot password', async () => {
      userDao.fetch.mockResolvedValueOnce({ email: 'test@newor.com', isVerified: true });
      mailer.sendMail.mockResolvedValueOnce();

      await expect(userService.forgotPassword('test@newor.com')).resolves.toStrictEqual({
        email: 'test@newor.com',
      });
    });

    it('should throw error when email not found', async () => {
      userDao.fetch.mockResolvedValueOnce(null);

      await expect(userService.forgotPassword('test@newor.com')).rejects.toStrictEqual({
        status: 404,
        data: {
          code: 'NEWOR_USER_NOT_FOUND',
          description: 'User not found.',
        },
      });
    });

    it('should throw error when email is not verified', async () => {
      userDao.fetch.mockResolvedValueOnce({ email: 'test@newor.com', isVerified: false });

      await expect(userService.forgotPassword('test@newor.com')).rejects.toStrictEqual({
        status: 403,
        data: {
          code: 'NEWOR_EMAIL_NOT_VERIFIED',
          description: 'Email verification incomplete.',
        },
      });
    });
  });

  describe('resetPassword', () => {
    it('should throw error when token verification fails', async () => {
      jwt.verify.mockReturnValueOnce(false);

      await expect(userService.resetPassword({ token: 'testtoken123', password: '123456' })).rejects.toStrictEqual({
        status: 401,
        data: {
          code: 'NEWOR_INVALID_CREDENTIALS',
          description: 'Invalid credentials.',
        },
      });
    });

    it('should throw error when user data update fails', async () => {
      jwt.verify.mockReturnValueOnce(true);
      jwt.decode.mockReturnValueOnce({ id: 'testuserid' });
      userDao.update.mockRejectedValueOnce({});

      await expect(userService.resetPassword({ token: 'testtoken123', password: '123456' })).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });

    it('should return success data when reset password is success', async () => {
      jwt.verify.mockReturnValueOnce(true);
      jwt.decode.mockReturnValueOnce({ id: 'testuserid' });
      userDao.update.mockResolvedValueOnce({ email: 'test@newor.com' });

      await expect(userService.resetPassword({ token: 'testtoken123', password: '123456' })).resolves.toStrictEqual({
        email: 'test@newor.com',
      });
    });
  });
});
