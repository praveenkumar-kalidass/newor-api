const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const assetService = require('../service/Asset');
const assetController = require('./Asset');

jest.mock('../service/Asset', () => ({
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
      url: '/api/asset/v1',
      params: {
        assetId: 'test_asset_id',
      },
    });

    it('should successfully get asset details', async () => {
      assetService.calculate.mockResolvedValueOnce({ id: 'test_asset_id' });

      await assetController.getV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({ id: 'test_asset_id' });
    });

    it('should return bad request for invalid params', async () => {
      const noBodyMock = httpMocks.createRequest({
        method: 'GET',
        url: '/api/asset/v1',
        params: {},
      });

      await assetController.getV1(noBodyMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });

    it('should return error when calculate asset fails', async () => {
      assetService.calculate.mockRejectedValueOnce(neworError.INTERNAL_SERVER_ERROR);

      await assetController.getV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.INTERNAL_SERVER_ERROR.data);
    });
  });
});
