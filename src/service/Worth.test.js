const assetService = require('./Asset');
const liabilityService = require('./Liability');
const worthService = require('./Worth');
const neworError = require('../constant/error');

jest.mock('./Asset', () => ({
  calculate: jest.fn(),
}));
jest.mock('./Liability', () => ({
  calculate: jest.fn(),
}));

describe('Worth Service', () => {
  const mockContext = {};

  describe('calculate', () => {
    it('should successfully return networth', async () => {
      assetService.calculate.mockResolvedValueOnce({
        id: 'test_asset_id',
        value: 0.00,
      });
      liabilityService.calculate.mockResolvedValueOnce({
        id: 'test_liability_id',
        value: 0.00,
      });

      await expect(worthService.calculate(mockContext, 'test_user_id'))
        .resolves.toStrictEqual({
          value: 0.00,
          asset: {
            id: 'test_asset_id',
            value: 0.00,
          },
          liability: {
            id: 'test_liability_id',
            value: 0.00,
          },
        });
    });

    it('should return error when calculation fails', async () => {
      assetService.calculate.mockRejectedValueOnce(neworError.INTERNAL_SERVER_ERROR);
      liabilityService.calculate.mockResolvedValueOnce({
        id: 'test_liability_id',
        value: 0.00,
      });

      await expect(worthService.calculate(mockContext, 'test_user_id'))
        .rejects.toStrictEqual(neworError.INTERNAL_SERVER_ERROR);
    });
  });
});
