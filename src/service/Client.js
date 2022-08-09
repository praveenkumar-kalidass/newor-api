const passwordHash = require('password-hash');

const neworError = require('../constant/error');
const clientDao = require('../dao/Client');
const constant = require('../constant');
const logger = require('../helper/logger');

const authorize = async (ctxt, client) => {
  const log = await logger.init(ctxt, 'oauth2-server', {
    class: 'client_service',
    method: 'authorize',
  });
  try {
    log.info('Initiating authorize client.');
    const result = await clientDao.fetchBy(log.context, client.id);
    if (!result) {
      log.info(`No client found with id: ${client.id}`);
      throw neworError.CLIENT_NOT_FOUND;
    }
    if (!client.secret || passwordHash.verify(client.secret, result.secret)) {
      log.info('Successfully verified client credentials.');
      const { AUTH_GRANT_TYPE } = constant;
      delete result.secret;
      return {
        ...result,
        grants: [
          AUTH_GRANT_TYPE.PASSWORD,
          AUTH_GRANT_TYPE.AUTHORIZATION_CODE,
          AUTH_GRANT_TYPE.REFRESH_TOKEN,
        ],
        redirectUris: ['authorize'],
      };
    }
    log.info('Client credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    log.error(`Error while authorize client. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  } finally {
    if (!ctxt) {
      log.end();
    }
  }
};

module.exports = {
  authorize,
};
