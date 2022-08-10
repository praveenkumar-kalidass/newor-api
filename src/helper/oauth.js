const OAuthServer = require('oauth2-server');

const clientService = require('../service/Client');
const userService = require('../service/User');
const authTokenService = require('../service/AuthToken');

const getModel = () => ({
  getClient: async (id, secret) => {
    try {
      const client = await clientService.authorize(null, { id, secret });
      return client;
    } catch (error) {
      return null;
    }
  },
  saveAuthorizationCode: (code) => code,
  getUser: async (email, password) => {
    try {
      const user = await userService.login(null, { email, password });
      return user;
    } catch (error) {
      return null;
    }
  },
  saveToken: async (accessToken, client, user) => {
    try {
      const token = await authTokenService.persist(null, accessToken, client, user);
      return token;
    } catch (error) {
      return null;
    }
  },
  getAccessToken: async (accessToken) => {
    try {
      const token = await authTokenService.find(null, accessToken);
      return token;
    } catch (error) {
      return null;
    }
  },
  getRefreshToken: (refreshToken) => ({
    refreshToken,
    client: {},
    user: {},
  }),
  revokeToken: () => true,
});

const oAuth = new OAuthServer({
  model: getModel(),
  allowEmptyState: true,
  requireClientAuthentication: { password: false },
});

module.exports = oAuth;
