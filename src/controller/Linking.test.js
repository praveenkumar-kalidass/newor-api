const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const linkingController = require('./Linking');

jest.mock('../helper/template');

describe('Linking controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
    redirect: jest.fn(),
  };

  describe('linkingV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/linking/v1/test/test_token',
      params: {
        path: 'test',
        token: 'test_token',
      },
    });

    it('should successfully redirect link url', async () => {
      await linkingController.linkingV1(requestMock, responseMock);

      expect(responseMock.redirect).toHaveBeenCalledWith('newor://test/test_token');
    });

    it('should successfully redirect link url', async () => {
      const noPathMock = httpMocks.createRequest({
        method: 'POST',
        url: '/api/linking/v1/test/test_token',
        params: {
          path: '',
          token: 'test_token',
        },
      });

      await linkingController.linkingV1(noPathMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });
  });
});
