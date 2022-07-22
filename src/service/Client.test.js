const passwordHash = require('password-hash');

const clientService = require('./Client');
const clietDao = require('../dao/Client');

jest.mock('../dao/Client', () => ({
  fetchBy: jest.fn(),
}));

describe('Client Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authorize', () => {
    it('should successfully authorize client', async () => {
      const expectedResponse = {
        id: 'test',
        secret: passwordHash.generate('test@123'),
        grants: ['password', 'authorization_code', 'refresh_token'],
        redirectUris: ['authorize'],
      };
      clietDao.fetchBy.mockResolvedValueOnce(expectedResponse);

      await expect(clientService.authorize({ id: 'test', secret: 'test@123' })).resolves.toStrictEqual(expectedResponse);
    });

    it('should throw client not found error', async () => {
      clietDao.fetchBy.mockResolvedValueOnce(null);

      await expect(clientService.authorize({ id: 'test', secret: 'test' })).rejects.toStrictEqual({
        status: 403,
        data: {
          code: 'NEWOR_CLIENT_NOT_FOUND',
          description: 'Client not found.',
        },
      });
    });

    it('should throw invalid credentials error', async () => {
      const expectedResponse = { id: 'test', secret: passwordHash.generate('test@123') };
      clietDao.fetchBy.mockResolvedValueOnce(expectedResponse);

      await expect(clientService.authorize({ id: 'test', secret: 'test' })).rejects.toStrictEqual({
        status: 401,
        data: {
          code: 'NEWOR_INVALID_CREDENTIALS',
          description: 'Invalid credentials.',
        },
      });
    });

    it('should throw error when authorize client', async () => {
      clietDao.fetchBy.mockRejectedValueOnce(Error('Client error'));

      await expect(clientService.authorize({ id: 'test', secret: 'test@123' })).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });
  });
});
