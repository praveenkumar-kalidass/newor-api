const authTokenService = require('./AuthToken');
const authTokenDao = require('../dao/AuthToken');

jest.mock('../dao/AuthToken', () => ({
  save: jest.fn(),
  fetch: jest.fn(),
  revoke: jest.fn(),
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

  describe('findByType', () => {
    it('should successfully return token', async () => {
      authTokenDao.fetch.mockResolvedValueOnce({
        accessToken: 'test_access_token',
        accessTokenExpiresAt: '2022-08-10T13:54:30.578Z',
        clientId: 'test_client_id',
        userId: 'test_user_id',
      });

      await expect(authTokenService.findByType(mockContext, 'accessToken', 'test_access_token'))
        .resolves.toStrictEqual({
          accessToken: 'test_access_token',
          accessTokenExpiresAt: '2022-08-10T13:54:30.578Z',
          clientId: 'test_client_id',
          userId: 'test_user_id',
          client: { id: 'test_client_id' },
          user: { id: 'test_user_id' },
        });
    });

    it('should throw error when token is not found', async () => {
      authTokenDao.fetch.mockResolvedValueOnce();

      await expect(authTokenService.findByType(mockContext, 'accessToken', 'test_access_token'))
        .rejects.toStrictEqual({
          status: 500,
          data: {
            code: 'NEWOR_INTERNAL_SERVER_ERROR',
            description: 'Internal Server error',
          },
        });
    });
  });

  describe('remove', () => {
    it('should successfully remove token', async () => {
      authTokenDao.revoke.mockResolvedValueOnce(true);

      await expect(authTokenService.remove(mockContext, 'test_access_token', 'test_user_id'))
        .resolves.toStrictEqual({ deleted: true });
    });

    it('should throw error when token is not deleted', async () => {
      authTokenDao.revoke.mockResolvedValueOnce(false);

      await expect(authTokenService.remove(mockContext, 'test_access_token', 'test_user_id'))
        .rejects.toStrictEqual({
          status: 500,
          data: {
            code: 'NEWOR_INTERNAL_SERVER_ERROR',
            description: 'Internal Server error',
          },
        });
    });
  });
});
