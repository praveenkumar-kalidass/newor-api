const passwordHash = require('password-hash');

const userService = require('./User');
const userDao = require('../dao/User');

jest.mock('../dao/User', () => ({
  save: jest.fn(),
  fetch: jest.fn(),
}));

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should successfully signup user', async () => {
      const expectedResponse = { id: 1, username: 'Test', password: 'password' };
      userDao.save.mockResolvedValueOnce(expectedResponse);

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
      const expectedResponse = { email: 'test@test.com', password: passwordHash.generate('test@123') };
      userDao.fetch.mockResolvedValueOnce(expectedResponse);

      await expect(userService.login({ email: 'test@test.com', password: 'test@123' })).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw user not found error', async () => {
      userDao.fetch.mockResolvedValueOnce(null);

      await expect(userService.login({ email: 'test@test.com', password: 'test' })).rejects.toStrictEqual({
        status: 403,
        data: {
          code: 'NEWOR_USER_NOT_FOUND',
          description: 'User not found.',
        },
      });
    });

    it('should throw invalid credentials error', async () => {
      const expectedResponse = { email: 'test@test.com', password: passwordHash.generate('test@123') };
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
});
