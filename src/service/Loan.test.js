const loanService = require('./Loan');
const loanDao = require('../dao/Loan');
const liabilityDao = require('../dao/Liability');

jest.mock('../dao/Loan', () => ({
  save: jest.fn(),
}));

jest.mock('../dao/Liability', () => ({
  fetch: jest.fn(),
  update: jest.fn(),
}));

describe('Loan Service', () => {
  const mockContext = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create loan', async () => {
      loanDao.save.mockResolvedValueOnce({ value: 123 });
      liabilityDao.fetch.mockResolvedValueOnce({ list: ['LOAN'] });

      await expect(loanService.create(mockContext, {
        value: 123,
      })).resolves.toStrictEqual({ value: 123 });
    });

    it('should update liability list with LOAN', async () => {
      loanDao.save.mockResolvedValueOnce({ value: 123 });
      liabilityDao.fetch.mockResolvedValueOnce({ list: [] });
      liabilityDao.update.mockResolvedValueOnce();

      await expect(loanService.create(mockContext, {
        value: 123,
      })).resolves.toStrictEqual({ value: 123 });
    });

    it('should return error when loan creation failed', async () => {
      loanDao.save.mockRejectedValueOnce();

      await expect(loanService.create(mockContext, {
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
