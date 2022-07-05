const passwordHash = require('password-hash');

const neworError = require('../constant/error');
const clientDao = require('../dao/Client');
const constant = require('../constant');

const authorize = async (client) => {
  try {
    console.log('Initiating authorize client.');
    const result = await clientDao.fetchBy(client.id);
    if (!result) {
      console.log('No client found with id: ', client.id);
      throw neworError.CLIENT_NOT_FOUND;
    }
    if (!client.secret || passwordHash.verify(client.secret, result.dataValues.secret)) {
      console.log('Successfully verified client credentials.');
      const { AUTH_GRANT_TYPE } = constant;
      return {
        ...result.dataValues,
        grants: [
          AUTH_GRANT_TYPE.PASSWORD,
          AUTH_GRANT_TYPE.AUTHORIZATION_CODE,
          AUTH_GRANT_TYPE.REFRESH_TOKEN,
        ],
        redirectUris: ['authorize'],
      };
    }
    console.log('Client credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    console.error('Error while authorize client. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  authorize,
};
