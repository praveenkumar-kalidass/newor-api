const model = require('../model');
const userDao = require('./User');

jest.mock('../model', () => ({
  User: {
    create: jest.fn(),
  },
}));

describe('User Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should successfully save user', async () => {
      const expectedResponse = { id: 1, username: 'Test', password: 'password' };
      model.User.create.mockResolvedValueOnce(expectedResponse);

      await expect(userDao.save({ username: 'Test', password: 'test@123' })).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw error when saving user', async () => {
      const expectedError = new Error('User error');
      model.User.create.mockRejectedValueOnce(expectedError);

      await expect(userDao.save({ username: 'Test', password: 'test@123' })).rejects.toStrictEqual(expectedError);
    });
  });
});
