const model = require('../model');
const logger = require('../helper/logger');

const save = async (ctxt, user) => {
  const log = logger.init(ctxt, null, {
    class: 'user_dao',
    method: 'save',
  });
  try {
    log.info('Saving user to database');
    const result = await model.User.create(user);
    log.info('Successfully saved user to database');
    delete result.dataValues.password;
    return result.dataValues;
  } catch (error) {
    log.error(`Error while saving user to database. Error: ${error}`);
    throw error;
  }
};

const fetch = async (ctxt, by) => {
  const log = logger.init(ctxt, null, {
    class: 'user_dao',
    method: 'fetch',
  });
  try {
    log.info('Fetching user from database');
    const result = await model.User.findOne({ where: by });
    if (!result) return result;
    log.info('Successfully fetched user from database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while fetching user from database. Error: ${error}`);
    throw error;
  }
};

const update = async (ctxt, by, user) => {
  const log = logger.init(ctxt, null, {
    class: 'user_dao',
    method: 'update',
  });
  try {
    log.info('Updating user in database');
    const result = await model.User.update(user, { where: by });
    if (!result) return result;
    log.info('Successfully updated user in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while updating user from database. Error: ${error}`);
    throw error;
  }
};

module.exports = {
  save,
  fetch,
  update,
};
