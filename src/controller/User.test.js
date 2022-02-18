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
    it('should send user data as success response', async () => {
      const expectedResponse = { id: 'user_id' };
      userService.signup.mockResolvedValueOnce(expectedResponse);
      
      await userController.signupV1({}, responseMock);

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
      
      await userController.signupV1({}, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(expectedError.data);
    });
  });
});
