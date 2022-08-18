const httpMocks = require('node-mocks-http');

const neworError = require('../constant/error');
const userService = require('../service/User');
const authTokenService = require('../service/AuthToken');
const oAuth = require('../helper/oauth');
const token = require('../helper/token');
const userController = require('./User');

jest.mock('../service/User', () => ({
  signup: jest.fn(),
  login: jest.fn(),
  verify: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updatePicture: jest.fn(),
}));
jest.mock('../service/AuthToken', () => ({
  remove: jest.fn(),
}));
jest.mock('../service/Client', () => ({
  authorize: jest.fn(),
}));

describe('User Controller', () => {
  const responseMock = {
    status: jest.fn(() => ({ send: jest.fn() })),
    set: jest.fn(),
    redirect: jest.fn(),
    send: jest.fn(),
    format: jest.fn(),
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
        mobileNumber: '9876543210',
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
      headers: {
        location: 'authorize',
      },
    });

    it('should redirect authorisation code as success response', async () => {
      userService.login.mockResolvedValueOnce({ id: 'user_id' });
      oAuth.authorize.mockResolvedValueOnce();

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

  describe('authorizeV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/v1/authorize',
      body: {
        clientId: 'test_client_id',
        clientSecret: 'test_secret',
        grantType: 'refresh_token',
        refreshToken: 'test_refresh_token',
      },
    });

    it('should successfully authorize', async () => {
      oAuth.token.mockResolvedValueOnce({ accessToken: 'test_access_token' });

      await userController.authorizeV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({ accessToken: 'test_access_token' });
    });

    it('should return error when authorization failed', async () => {
      oAuth.token.mockRejectedValueOnce({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });

      await userController.authorizeV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        code: 'NEWOR_INTERNAL_SERVER_ERROR',
        description: 'Internal Server error',
      });
    });
  });

  describe('verifyV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'PUT',
      url: '/api/user/v1/verify',
      body: {
        token: 'testtoken123',
      },
    });

    it('should send status as success response', async () => {
      const expectedResponse = { id: 'testuserid' };
      userService.verify.mockResolvedValueOnce(expectedResponse);

      await userController.verifyV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return error when verification fails', async () => {
      userService.verify.mockRejectedValueOnce({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });

      await userController.verifyV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        code: 'NEWOR_INTERNAL_SERVER_ERROR',
        description: 'Internal Server error',
      });
    });
  });

  describe('forgotPasswordV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'POST',
      url: '/api/v1/forgot-password',
      body: {
        email: 'test@newor.com',
      },
    });

    it('should send user data as success response', async () => {
      const expectedResponse = { email: 'test@newor.com' };
      userService.forgotPassword.mockResolvedValueOnce(expectedResponse);

      await userController.forgotPasswordV1(requestMock, responseMock);

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
      userService.forgotPassword.mockRejectedValueOnce(expectedError);

      await userController.forgotPasswordV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(expectedError.data);
    });
  });

  describe('resetPasswordV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'PUT',
      url: '/api/user/v1/reset-password',
      body: {
        token: 'testtoken123',
        password: '123456',
      },
    });

    it('should send user data as success response', async () => {
      const expectedResponse = { email: 'test@newor.com' };
      userService.resetPassword.mockResolvedValueOnce(expectedResponse);

      await userController.resetPasswordV1(requestMock, responseMock);

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
      userService.resetPassword.mockRejectedValueOnce(expectedError);

      await userController.resetPasswordV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(expectedError.data);
    });
  });

  describe('logoutV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'DELETE',
      url: '/api/user/v1/logout',
    });

    it('should successfully logout', async () => {
      token.getAccessToken.mockResolvedValueOnce('test_access_token');
      token.getUser.mockResolvedValueOnce({ id: 'test_user_id' });
      authTokenService.remove.mockResolvedValueOnce({ deleted: true });

      await userController.logoutV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        deleted: true,
      });
    });

    it('should return error when logout is failed', async () => {
      token.getAccessToken.mockResolvedValueOnce('test_access_token');
      token.getUser.mockResolvedValueOnce({ id: 'test_user_id' });
      authTokenService.remove.mockRejectedValueOnce(neworError.UNAUTHENTICATED);

      await userController.logoutV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(neworError.UNAUTHENTICATED.status);
      expect(responseMock.status.mock.results[0].value.send)
        .toHaveBeenCalledWith(neworError.UNAUTHENTICATED.data);
    });
  });

  describe('pictureV1', () => {
    const requestMock = httpMocks.createRequest({
      method: 'PUT',
      url: '/api/user/v1/picture',
      files: {
        picture: {
          data: 'test',
          mimetype: 'image/png',
        },
      },
    });

    it('should successfully update the user picture', async () => {
      token.getUser.mockResolvedValueOnce({ id: 'test_user_id' });
      userService.updatePicture.mockResolvedValueOnce({ data: 'test' });

      await userController.pictureV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        data: 'test',
      });
    });

    it('should throw bad request error when request file type is not valid', async () => {
      const noFileRequestMock = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/user/v1/picture',
        files: {
          picture: {
            data: 'test',
            mimetype: 'image/gif',
          },
        },
      });

      await userController.pictureV1(noFileRequestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        code: 'NEWOR_BAD_REQUEST',
        description: 'Bad request',
      });
    });

    it('should throw error when user service throws error', async () => {
      token.getUser.mockResolvedValueOnce({ id: 'test_user_id' });
      userService.updatePicture.mockRejectedValueOnce({
        status: 500,
        data: {
          code: 'NEWOR_INTERNAL_SERVER_ERROR',
          description: 'Internal Server error',
        },
      });

      await userController.pictureV1(requestMock, responseMock);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.status.mock.results[0].value.send).toHaveBeenCalledWith({
        code: 'NEWOR_INTERNAL_SERVER_ERROR',
        description: 'Internal Server error',
      });
    });
  });
});
