const model = require('../model');
const logger = require('../helper/logger');

const save = async (ctxt, deposit) => {
  const log = logger.init(ctxt, null, {
    class: 'deposit_dao',
    method: 'save',
  });
  try {
    log.info('Saving deposit in database');
    const result = await model.Deposit.create(deposit);
    log.info('Successfully saved deposit in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while saving deposit in database. Error: ${error}`);
    throw error;
  }
};

module.exports = { save };
