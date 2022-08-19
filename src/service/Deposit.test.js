const depositService = require('./Deposit');
const depositDao = require('../dao/Deposit');
const assetDao = require('../dao/Asset');

jest.mock('../dao/Deposit', () => ({
  save: jest.fn(),
}));

jest.mock('../dao/Asset', () => ({
  fetch: jest.fn(),
  update: jest.fn(),
}));

describe('Deposit Service', () => {
  const mockContext = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create deposit', async () => {
      depositDao.save.mockResolvedValueOnce({ value: 123 });
      assetDao.fetch.mockResolvedValueOnce({ list: ['DEPOSIT'] });

      await expect(depositService.create(mockContext, {
        value: 123,
      })).resolves.toStrictEqual({ value: 123 });
    });

    it('should update asset list with DEPOSIT', async () => {
      depositDao.save.mockResolvedValueOnce({ value: 123 });
      assetDao.fetch.mockResolvedValueOnce({ list: [] });
      assetDao.update.mockResolvedValueOnce();

      await expect(depositService.create(mockContext, {
        value: 123,
      })).resolves.toStrictEqual({ value: 123 });
    });

    it('should return error when deposit creation failed', async () => {
      depositDao.save.mockRejectedValueOnce();

      await expect(depositService.create(mockContext, {
        value: 123,
      })).rejects.toStrictEqual({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });
    });
  });
});
