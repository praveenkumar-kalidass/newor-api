const model = require('../model');
const logger = require('../helper/logger');

const save = async (ctxt, token) => {
  const log = await logger.init(ctxt, null, {
    class: 'auth_token_dao',
    method: 'save',
  });
  try {
    log.info('Saving auth token to database');
    const result = await model.AuthToken.create(token);
    log.info('Successfully saved auth token to database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while saving auth token to database. Error: ${error}`);
    throw error;
  }
};

const fetch = async (ctxt, by) => {
  const log = await logger.init(ctxt, null, {
    class: 'auth_token_dao',
    method: 'save',
  });
  try {
    log.info('Getting auth token from database');
    const result = await model.AuthToken.findOne({
      where: by,
      include: {
        model: model.User,
        as: 'user',
      },
    });
    if (!result) return result;
    log.info('Successfully got auth token from database');
    const user = result.dataValues.user.dataValues;
    delete user.password;
    return {
      ...result.dataValues,
      user,
    };
  } catch (error) {
    log.error(`Error while getting auth token from database. Error: ${error}`);
    throw error;
  }
};

const revoke = async (ctxt, by) => {
  const log = await logger.init(ctxt, null, {
    class: 'auth_token_dao',
    method: 'revoke',
  });
  try {
    log.info('Deleting auth token from database');
    const result = await model.AuthToken.destroy({ where: by });
    log.info('Successfully revoked auth token from database');
    return Boolean(result);
  } catch (error) {
    log.error(`Error while revoking auth token from database. Error: ${error}`);
    throw error;
  }
};

module.exports = {
  save,
  fetch,
  revoke,
};
