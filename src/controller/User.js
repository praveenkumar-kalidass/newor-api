const joi = require('joi');
const OAuthServer = require('oauth2-server');

const userSchema = require('../schema/User');
const userService = require('../service/User');
const neworError = require('../constant/error');

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
  model: {
    getClient: () => ({
      id: 'dummy_client_id',
      grants: ['password', 'authorization_code', 'refresh_token'],
      redirectUris: ['authorize'],
    }),
    saveAuthorizationCode: (code) => code,
  },
  allowEmptyState: true,
  requireClientAuthentication: { password: false },
});

const loginV1 = async (request, response) => {
  try {
    console.log('Initiating user login v1 api.');
    await userSchema.loginV1.validateAsync(request.body);
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(response);
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

module.exports = {
  signupV1,
  loginV1,
};
