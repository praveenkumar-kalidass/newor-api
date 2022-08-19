const neworError = require('../constant/error');
const assetDao = require('../dao/Asset');
const assetService = require('./Asset');

jest.mock('../dao/Asset', () => ({
  fetch: jest.fn(),
}));

describe('Asset Service', () => {
  const mockContext = {};

  describe('calculate', () => {
    it('should successfully return asset worth', async () => {
      assetDao.fetch.mockResolvedValueOnce({ id: 'test_asset_id' });

      await expect(assetService.calculate(mockContext, 'test_user_id'))
        .resolves.toStrictEqual({
          id: 'test_asset_id',
          value: 0.00,
        });
    });

    it('should return error when asset calculation failed', async () => {
      assetDao.fetch.mockRejectedValueOnce();

      await expect(assetService.calculate(mockContext, 'test_user_id'))
        .rejects.toStrictEqual(neworError.INTERNAL_SERVER_ERROR);
    });
  });
});
