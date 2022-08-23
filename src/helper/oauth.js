const OAuthServer = require('oauth2-server');

const clientService = require('../service/Client');
const userService = require('../service/User');
const authTokenService = require('../service/AuthToken');
const logger = require('./logger');

const getModel = () => ({
  getClient: async (id, secret) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'getClient',
    });
    try {
      const client = await clientService.authorize(log.context, { id, secret });
      return client;
    } catch (error) {
      return null;
    } finally {
      log.end();
    }
  },
  saveAuthorizationCode: (code) => code,
  getUser: async (email, password) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'getUser',
    });
    try {
      const user = await userService.login(log.context, { email, password });
      return user;
    } catch (error) {
      return null;
    } finally {
      log.end();
    }
  },
  saveToken: async (accessToken, client, user) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'saveToken',
    });
    try {
      const token = await authTokenService.persist(log.context, accessToken, client, user);
      return token;
    } catch (error) {
      return null;
    } finally {
      log.end();
    }
  },
  getAccessToken: async (accessToken) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'getAccessToken',
    });
    try {
      const token = await authTokenService.findByType(log.context, 'accessToken', accessToken);
      return token;
    } catch (error) {
      return null;
    } finally {
      log.end();
    }
  },
  getRefreshToken: async (refreshToken) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'getRefreshToken',
    });
    try {
      const token = await authTokenService.findByType(log.context, 'refreshToken', refreshToken);
      return token;
    } catch (error) {
      return null;
    } finally {
      log.end();
    }
  },
  revokeToken: async (token) => {
    const log = logger.init(null, 'oauth2-server', {
      class: 'oauth',
      method: 'revokeToken',
    });
    try {
      const { deleted } = await authTokenService
        .remove(log.context, token.accessToken, token.user.id);
      return deleted;
    } catch (error) {
      return false;
    } finally {
      log.end();
    }
  },
});

const oAuth = new OAuthServer({
  model: getModel(),
  allowEmptyState: true,
  alwaysIssueNewRefreshToken: true,
});

module.exports = oAuth;
