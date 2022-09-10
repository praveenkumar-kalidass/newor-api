const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const liabilityService = require('../service/Liability');
const liabilityController = require('./Liability');

jest.mock('../service/Liability', () => ({
  calculate: jest.fn(),
}));

describe('Deposit controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'GET',
      url: '/api/liability/v1',
      params: {
        liabilityId: 'test_liability_id',
      },
    });

    it('should successfully get liability details', async () => {
      liabilityService.calculate.mockResolvedValueOnce({ id: 'test_liability_id' });

      await liabilityController.getV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({ id: 'test_liability_id' });
    });

    it('should return bad request for invalid params', async () => {
      const noBodyMock = httpMocks.createRequest({
        method: 'GET',
        url: '/api/liability/v1',
        params: {},
      });

      await liabilityController.getV1(noBodyMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });

    it('should return error when calculate liability fails', async () => {
      liabilityService.calculate.mockRejectedValueOnce(neworError.INTERNAL_SERVER_ERROR);

      await liabilityController.getV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.INTERNAL_SERVER_ERROR.data);
    });
  });
});
