const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const depositService = require('../service/Deposit');
const depositController = require('./Deposit');

jest.mock('../service/Deposit', () => ({
  create: jest.fn(),
}));

describe('Deposit controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/deposit/v1',
      body: {
        type: 'SAVINGS',
        interestRate: 1.23,
        value: 123.12,
        depositoryName: 'ABC',
        startedAt: '01-10-2010',
        maturityAt: '01-10-2015',
        assetId: 'test_asset_id',
      },
    });

    it('should successfully post deposit', async () => {
      depositService.create.mockResolvedValueOnce({ id: 'test_deposit_id' });

      await depositController.postV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({ id: 'test_deposit_id' });
    });

    it('should return bad request for invalid body', async () => {
      const noBodyMock = httpMocks.createRequest({
        method: 'POST',
        url: '/api/deposit/v1',
        body: {},
      });

      await depositController.postV1(noBodyMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });

    it('should return error when post deposit fails', async () => {
      depositService.create.mockRejectedValueOnce(neworError.INTERNAL_SERVER_ERROR);

      await depositController.postV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.INTERNAL_SERVER_ERROR.data);
    });
  });
});
