const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const userService = require('../service/User');
const userController = require('./User');

jest.mock('../service/User', () => ({
  signup: jest.fn(),
  login: jest.fn(),
  verify: jest.fn(),
}));
jest.mock('../service/Client', () => ({
  authorize: jest.fn(),
}));
jest.mock('../helper/oauth', () => ({
  getModel: () => ({
    getClient: jest.fn((id) => ({ id, grants: ['password', 'authorization_code'], redirectUris: ['authorize'] })),
    saveAuthorizationCode: jest.fn((code) => code),
    saveToken: jest.fn((accessToken, client, user) => ({ ...accessToken, client, user })),
  }),
}));

describe('User Controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
    set: jest.fn(),
    redirect: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signupV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/v1/signup',
      body: {
        firstName: 'Test',
        lastName: 'Newor',
        email: 'test@gmail.com',
        password: 'qwerty',
      },
    });

    it('should send user data as success response', async () => {
      const expectedResponse = { id: 'user_id' };
      userService.signup.mockResolvedValueOnce(expectedResponse);

      await userController.signupV1(requestMock, responseMock);

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

      await userController.signupV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(expectedError.data);
    });

    it('should send bad request for invalid request', async () => {
      await userController.signupV1({ body: {} }, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });
  });

  describe('loginV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/v1/login',
      body: {
        email: 'test@gmail.com',
        password: 'qwerty',
        client_id: 'test_client_id',
        client_secret: 'test_secret',
        grant_type: 'password',
        response_type: 'code',
      },
    });

    it('should redirect authorisation code as success response', async () => {
      userService.login.mockResolvedValueOnce({ id: 'user_id' });

      await userController.loginV1(requestMock, responseMock);

      expect(responseMock.set).toHaveBeenCalledWith(expect.objectContaining({ location: expect.stringMatching(/authorize/) }));
      expect(responseMock.redirect).toHaveBeenCalledWith(307, expect.stringMatching(/authorize/));
    });

    it('should send error data as failure response', async () => {
      const expectedError = {
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      };
      userService.login.mockRejectedValueOnce(expectedError);

      await userController.loginV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.INTERNAL_SERVER_ERROR.data);
    });

    it('should send bad request for invalid request', async () => {
      await userController.loginV1({ body: {} }, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.BAD_REQUEST.data);
    });
  });

  describe('verifyV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/user/v1/verify',
      params: {
        token: 'testtoken123',
      },
    });

    it('should send status as success response', async () => {
      const expectedResponse = { status: 'Success' };
      userService.verify.mockResolvedValueOnce(expectedResponse);

      await userController.verifyV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
