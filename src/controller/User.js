const joi = require('joi');
const OAuthServer = require('oauth2-server');

const userSchema = require('../schema/User');
const userService = require('../service/User');
const authTokenService = require('../service/AuthToken');
const worthService = require('../service/Worth');
const neworError = require('../constant/error');
const oAuth = require('../helper/oauth');
const logger = require('../helper/logger');
const token = require('../helper/token');

const signupV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'signupV1',
  });
  try {
    log.info('Initiating user signup v1 api.');
    await userSchema.signupV1.validateAsync(request.body);
    const result = await userService.signup(log.context, request.body);
    response.status(200).send(result);
    log.info('Successfully completed user signup v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      log.error(`Error while validating user signup v1 request. Error: ${error}`);
      const { BAD_REQUEST } = neworError;
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while trying signup v1 api. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const loginV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'loginV1',
  });
  try {
    log.info('Initiating user login v1 api.');
    await userSchema.loginV1.validateAsync(request.body);
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(request);
    const { email, password } = request.body;
    const user = await userService.login(log.context, { email, password });
    await oAuth.authorize(oauthRequest, oauthResponse, {
      authenticateHandler: {
        handle: () => user,
      },
    });
    log.info('Redirecting to authorize user login.');
    response.set(oauthResponse.headers);
    response.redirect(307, oauthResponse.headers.location);
  } catch (error) {
    const { BAD_REQUEST } = neworError;
    if (joi.isError(error)) {
      log.error(`Error while validating user login v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while login for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const authorizeV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'authorizeV1',
  });
  try {
    log.info('Initiating user authorize v1 api');
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(request);
    const result = await oAuth.token(oauthRequest, oauthResponse, {});
    log.info('User authorisation completed successfully');
    response.status(200).send(result);
  } catch (error) {
    log.error(`Error while authorize for user. Error: ${error}`);
    response.status(neworError.UNAUTHENTICATED.status).send(neworError.UNAUTHENTICATED.data);
  } finally {
    log.end();
  }
};

const verifyV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'verifyV1',
  });
  try {
    log.info('Initiating user verify v1 api.');
    await userSchema.verifyV1.validateAsync(request.body);
    const result = await userService.verify(log.context, request.body.token);
    response.status(200).send(result);
    log.info('Successfully completed user verify v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating user verification v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while verifying user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const forgotPasswordV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'forgotPasswordV1',
  });
  try {
    log.info('Initiating forgot passwor d v1 api');
    await userSchema.forgotPasswordV1.validateAsync(request.body);
    const result = await userService.forgotPassword(log.context, request.body.email);
    response.status(200).send(result);
    log.info('Successfully completed forgot password v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating forgot password v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while requesting forgot password user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const resetPasswordV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'resetPasswordV1',
  });
  try {
    log.info('Initiating reset password v1 api');
    await userSchema.resetPasswordV1.validateAsync(request.body);
    const result = await userService.resetPassword(log.context, request.body);
    response.status(200).send(result);
    log.info('Successfully completed reset password v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating reset password v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while requesting reset password user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const logoutV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'logoutV1',
  });
  try {
    log.info('Initiating logout v1 api');
    const accessToken = await token.getAccessToken(request);
    const { id } = await token.getUser(request);
    const result = await authTokenService.remove(log.context, accessToken, id);
    response.status(200).send(result);
    log.info('Successfully completed logout v1 api.');
  } catch (error) {
    log.error(`Error while logging out user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const pictureV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'pictureV1',
  });
  try {
    log.info('Initiating picture v1 api');
    if (!request.files) {
      throw neworError.BAD_REQUEST;
    }
    await userSchema.pictureV1.validateAsync({
      picture: request.files.picture.mimetype,
    });
    if (Buffer.byteLength(request.files.picture.data) > 5000000) {
      throw neworError.FILE_SIZE_EXCEEDED;
    }
    const { id } = await token.getUser(request);
    const result = await userService.updatePicture(log.context, request.files.picture, id);
    response.status(200).send(result);
    log.info('Successfully completed picture v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating logout v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while updating picture for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

const worthV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'user_controller',
    method: 'worthV1',
  });
  try {
    log.info('Initiating user worth v1 api');
    const { id } = await token.getUser(request);
    const result = await worthService.calculate(log.context, id);
    log.info('Successfully completed user worth v1 api.');
    response.status(200).send(result);
  } catch (error) {
    log.error(`Error while getting net-worth for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

module.exports = {
  signupV1,
  loginV1,
  authorizeV1,
  verifyV1,
  forgotPasswordV1,
  resetPasswordV1,
  logoutV1,
  pictureV1,
  worthV1,
};
