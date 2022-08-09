const authTokenService = require('./AuthToken');
const authTokenDao = require('../dao/AuthToken');

jest.mock('../dao/AuthToken', () => ({
  save: jest.fn(),
}));

describe('AuthToken Service', () => {
  const mockContext = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('persist', () => {
    it('should successfully persist auth token', async () => {
      const expectedResponse = {
        accessToken: 'test_access_token',
        client: { id: 'test_client_id' },
        user: { id: 'test_user_id' },
      };
      authTokenDao.save.mockResolvedValueOnce({ accessToken: 'test_access_token' });

      await expect(authTokenService.persist(
        mockContext,
        { accessToken: 'test_access_token' },
        { id: 'test_client_id' },
        { id: 'test_user_id' },
      )).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw error when persisting auth token', async () => {
      authTokenDao.save.mockRejectedValueOnce(Error('Auth token error'));

      await expect(authTokenService.persist(
        mockContext,
        { accessToken: 'test_access_token' },
        { id: 'test_client_id' },
        { id: 'test_user_id' },
      )).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });
  });
});
