const depositService = require('./Deposit');
const depositDao = require('../dao/Deposit');

jest.mock('../dao/Deposit', () => ({
  save: jest.fn(),
}));

describe('Deposit Service', () => {
  const mockContext = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create deposit', async () => {
      depositDao.save.mockResolvedValueOnce({ value: 123 });

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
