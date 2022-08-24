const neworError = require('../constant/error');
const assetDao = require('../dao/Asset');
const depositDao = require('../dao/Deposit');
const assetService = require('./Asset');

jest.mock('../dao/Asset', () => ({
  fetch: jest.fn(),
}));
jest.mock('../dao/Deposit', () => ({
  getAll: jest.fn(),
}));

describe('Asset Service', () => {
  const mockContext = {};

  describe('calculate', () => {
    it('should successfully return asset worth', async () => {
      assetDao.fetch.mockResolvedValueOnce({ id: 'test_asset_id', list: ['DEPOSIT'] });
      depositDao.getAll.mockResolvedValueOnce([{ value: 12345 }]);

      await expect(assetService.calculate(mockContext, 'test_user_id'))
        .resolves.toStrictEqual({
          id: 'test_asset_id',
          value: 12345,
        });
    });

    it('should successfully return asset details', async () => {
      assetDao.fetch.mockResolvedValueOnce({ id: 'test_asset_id', list: ['DEPOSIT'] });
      depositDao.getAll.mockResolvedValueOnce([{ value: 12345 }]);

      await expect(assetService.calculate(mockContext, 'test_user_id', true))
        .resolves.toStrictEqual({
          id: 'test_asset_id',
          value: 12345,
          list: [{ value: 12345 }],
        });
    });

    it('should return error when asset calculation failed', async () => {
      assetDao.fetch.mockRejectedValueOnce();

      await expect(assetService.calculate(mockContext, 'test_user_id'))
        .rejects.toStrictEqual(neworError.INTERNAL_SERVER_ERROR);
    });
  });
});
