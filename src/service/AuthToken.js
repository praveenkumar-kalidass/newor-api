const authTokenDao = require('../dao/AuthToken');
const neworError = require('../constant/error');
const logger = require('../helper/logger');

const persist = async (ctxt, token, client, user) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'auth_token_service',
    method: 'persist',
  });
  try {
    log.info('Persisting auth token with client and user data');
    const authToken = await authTokenDao.save(log.context, {
      ...token,
      clientId: client.id,
      userId: user.id,
    });
    log.info('Successfully persisted auth token with client and user data');
    return {
      ...authToken,
      client,
      user,
    };
  } catch (error) {
    log.error(`Error while persisting auth token. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

const find = async (ctxt, accessToken) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'auth_token_service',
    method: 'persist',
  });
  try {
    log.info('Getting user token based on authentication token');
    const result = await authTokenDao.fetch(log.context, { accessToken });
    if (!result) {
      log.info('Authentication Token not found.');
      throw neworError.UNAUTHENTICATED;
    }
    log.info('Successfully found user auth token');
    return {
      accessToken: result.accessToken,
      accessTokenExpiresAt: result.accessTokenExpiresAt,
      client: { id: result.clientId },
      user: { id: result.userId },
    };
  } catch (error) {
    log.error(`Error while persisting auth token. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

module.exports = {
  persist,
  find,
};
