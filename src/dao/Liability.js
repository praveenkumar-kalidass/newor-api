const model = require('../model');
const logger = require('../helper/logger');

const init = async (ctxt, liability) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_dao',
    method: 'init',
  });
  try {
    log.info('Initiating liability in database');
    const result = await model.Liability.create(liability);
    log.info('Successfully initiated liability in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while initiating liability in database. Error: ${error}`);
    throw error;
  }
};

const fetch = async (ctxt, by) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_dao',
    method: 'fetch',
  });
  try {
    log.info('Fetching liability from database');
    const result = await model.Liability.findOne({
      where: by,
    });
    log.info('Successfully fetched liability from database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while fetching liability from database. Error: ${error}`);
    throw error;
  }
};

const update = async (ctxt, by, liability) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_dao',
    method: 'update',
  });
  try {
    log.info('Updating liability in database');
    const result = await model.Liability.update(liability, { where: by });
    if (!result) return result;
    log.info('Successfully updated liability in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while updating liability in database. Error: ${error}`);
    throw error;
  }
};

module.exports = { init, fetch, update };
