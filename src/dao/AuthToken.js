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
    const result = await model.AuthToken.findOne({ where: by });
    if (!result) return result;
    log.info('Successfully got auth token from database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while getting auth token from database. Error: ${error}`);
    throw error;
  }
};

module.exports = {
  save,
  fetch,
};
