const neworError = require('../constant/error');
const liabilityDao = require('../dao/Liability');
const liabilityService = require('./Liability');

jest.mock('../dao/Liability', () => ({
  fetch: jest.fn(),
}));

describe('Liability Service', () => {
  const mockContext = {};

  describe('calculate', () => {
    it('should successfully return liability worth', async () => {
      liabilityDao.fetch.mockResolvedValueOnce({ id: 'test_liability_id' });

      await expect(liabilityService.calculate(mockContext, 'test_user_id'))
        .resolves.toStrictEqual({
          id: 'test_liability_id',
          value: 0.00,
        });
    });

    it('should return error when liability calculation failed', async () => {
      liabilityDao.fetch.mockRejectedValueOnce();

      await expect(liabilityService.calculate(mockContext, 'test_user_id'))
        .rejects.toStrictEqual(neworError.INTERNAL_SERVER_ERROR);
    });
  });
});
