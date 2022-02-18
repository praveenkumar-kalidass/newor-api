const userService = require('./User');
const userDao = require('../dao/User');

jest.mock('../dao/User', () => ({
  save: jest.fn(),
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
});
