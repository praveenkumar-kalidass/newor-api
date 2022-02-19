const neworError = require('../constant/error');
const userService = require('../service/User');
const userController = require('./User');

jest.mock('../service/User', () => ({
  signup: jest.fn(),
}));

describe('User Controller', () => {
  const responseMock = { status: jest.fn(() => ({ send: jest.fn() })) };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signupV1', () => {
    const request = {
      firstName: 'Test',
      lastName: 'Newor',
      email: 'test@gmail.com',
      password: 'qwerty',
    };

    it('should send user data as success response', async () => {
      const expectedResponse = { id: 'user_id' };
      userService.signup.mockResolvedValueOnce(expectedResponse);
      
      await userController.signupV1({ body: request }, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('should send error data as failure response', async () => {
      const expectedError = {
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      };
      userService.signup.mockRejectedValueOnce(expectedError);
      
      await userController.signupV1({ body: request }, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(expectedError.data);
    });

    it('should send bad request for invalid request', async () => {
      await userController.signupV1({ body: {} }, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });
  });
});
