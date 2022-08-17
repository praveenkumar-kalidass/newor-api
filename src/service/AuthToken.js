const jwt = require('jsonwebtoken');

const { appConfig: config } = require('../../config');
const authTokenDao = require('../dao/AuthToken');
const neworError = require('../constant/error');
const logger = require('../helper/logger');
const aws = require('../helper/aws');
const { getImageUri } = require('../helper/util');

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

const findByType = async (ctxt, tokenType, token) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'auth_token_service',
    method: 'persist',
  });
  try {
    log.info(`Getting user token based on authentication token type: ${tokenType}`);
    const result = await authTokenDao.fetch(log.context, { [tokenType]: token });
    if (!result) {
      log.info('Authentication Token not found.');
      throw neworError.UNAUTHENTICATED;
    }
    log.info(`Successfully found user auth token for token type ${tokenType}`);
    delete result.user.password;
    let picture = '';
    if (result.user.picture) {
      const { Body: body } = await aws.getFile({
        bucket: config.userPictureBucket,
        key: result.user.picture,
      });
      picture = getImageUri(body, result.user.picture);
    }
    return {
      ...result,
      client: { id: result.clientId },
      user: {
        ...result.user,
        picture,
        idToken: jwt.sign(result.user, config.idTokenSecret),
      },
    };
  } catch (error) {
    log.error(`Error while finding auth token. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

const remove = async (ctxt, accessToken, userId) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'auth_token_service',
    method: 'remove',
  });
  try {
    log.info(`Deleting access token for user with id ${userId}`);
    const result = await authTokenDao.revoke(log.context, {
      accessToken,
      userId,
    });
    if (!result) {
      log.info('Auth access token revoke failed.');
      throw neworError.INTERNAL_SERVER_ERROR;
    }
    log.info(`Successfully revoked access token for user with id ${userId}`);
    return { deleted: true };
  } catch (error) {
    log.error(`Error while removing auth token. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

module.exports = {
  persist,
  findByType,
  remove,
};
