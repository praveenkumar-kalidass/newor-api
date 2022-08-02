const joi = require('joi');
const OAuthServer = require('oauth2-server');

const userSchema = require('../schema/User');
const userService = require('../service/User');
const neworError = require('../constant/error');
const oauthHelper = require('../helper/oauth');

const signupV1 = async (request, response) => {
  try {
    console.log('Initiating user signup v1 api.');
    await userSchema.signupV1.validateAsync(request.body);
    const result = await userService.signup(request.body);
    response.status(200).send(result);
    console.log('Successfully completed user signup v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      console.error('Error while validating user signup v1 request. Error: ', error);
      const { BAD_REQUEST } = neworError;
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    console.error('Error while trying signup v1 api. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

const oAuth = new OAuthServer({
  model: oauthHelper.getModel(),
  allowEmptyState: true,
  requireClientAuthentication: { password: false },
});

const loginV1 = async (request, response) => {
  try {
    console.log('Initiating user login v1 api.');
    await userSchema.loginV1.validateAsync(request.body);
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(request);
    const { email, password } = request.body;
    const user = await userService.login({ email, password });
    await oAuth.authorize(oauthRequest, oauthResponse, {
      authenticateHandler: {
        handle: () => user,
      },
    });
    console.log('Redirecting to authorize user login.');
    response.set(oauthResponse.headers);
    response.redirect(neworError.REDIRECT.status, oauthResponse.headers.location);
  } catch (error) {
    const { BAD_REQUEST } = neworError;
    if (joi.isError(error)) {
      console.error('Error while validating user login v1 request. Error: ', error);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    console.error('Error while login for user. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

const authorizeV1 = async (request, response) => {
  try {
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(request);
    const result = await oAuth.token(oauthRequest, oauthResponse, {});
    response.status(200).send(result);
  } catch (error) {
    console.error('Error while authorize for user. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

const verifyV1 = async (request, response) => {
  try {
    console.log('Initiating user verify v1 api.');
    await userSchema.verifyV1.validateAsync(request.params);
    const result = await userService.verify(request.params.token);
    response.format({ html: () => { response.send(result); } });
    console.log('Successfully completed user verify v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      console.error('Error while validating user verification v1 request. Error: ', error);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    console.error('Error while verifying user. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

const forgotPasswordV1 = async (request, response) => {
  try {
    console.log('Initiating forgot passwor d v1 api');
    await userSchema.forgotPasswordV1.validateAsync(request.body);
    const result = await userService.forgotPassword(request.body.email);
    response.status(200).send(result);
    console.log('Successfully completed forgot password v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      console.error('Error while validating forgot password v1 request. Error: ', error);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    console.error('Error while requesting forgot password user. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

module.exports = {
  signupV1,
  loginV1,
  authorizeV1,
  verifyV1,
  forgotPasswordV1,
};
