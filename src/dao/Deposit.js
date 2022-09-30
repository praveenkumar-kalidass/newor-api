const model = require('../model');
const logger = require('../helper/logger');
const constant = require('../constant');

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

const getAll = async (ctxt, by, attributes) => {
  const log = logger.init(ctxt, null, {
    class: 'deposit_dao',
    method: 'getAll',
  });
  try {
    log.info('Getting all deposits from database');
    const result = await model.Deposit.findAll({
      where: by,
      attributes,
      order: [['created_at', 'DESC']],
    });
    log.info(`Successfully got #${result.length} deposits from database`);
    return result.map((deposit) => ({
      ...deposit.dataValues,
      assetType: constant.ASSET_TYPE.DEPOSIT,
    }));
  } catch (error) {
    log.error(`Error while getting deposits from database. Error: ${error}`);
    throw error;
  }
};

module.exports = { save, getAll };
