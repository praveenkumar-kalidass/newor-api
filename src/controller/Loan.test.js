const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const loanService = require('../service/Loan');
const loanController = require('./Loan');

jest.mock('../service/Loan', () => ({
  create: jest.fn(),
}));

describe('Loan controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/loan/v1',
      body: {
        type: 'HOME',
        interestRate: 1.23,
        value: 123.12,
        lenderName: 'ABC',
        startedAt: '01-10-2010',
        closingAt: '01-10-2015',
        liabilityId: 'test_liability_id',
      },
    });

    it('should successfully post loan', async () => {
      loanService.create.mockResolvedValueOnce({ id: 'test_loan_id' });

      await loanController.postV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({ id: 'test_loan_id' });
    });

    it('should return bad request for invalid body', async () => {
      const noBodyMock = httpMocks.createRequest({
        method: 'POST',
        url: '/api/loan/v1',
        body: {},
      });

      await loanController.postV1(noBodyMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });

    it('should return error when post loan fails', async () => {
      loanService.create.mockRejectedValueOnce(neworError.INTERNAL_SERVER_ERROR);

      await loanController.postV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.INTERNAL_SERVER_ERROR.data);
    });
  });
});
