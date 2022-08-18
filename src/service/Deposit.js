const depositDao = require('../dao/Deposit');
const neworError = require('../constant/error');
const logger = require('../helper/logger');

const create = async (ctxt, deposit) => {
  const log = await logger.init(ctxt, null, {
    class: 'client_service',
    method: 'authorize',
  });
  try {
    log.info('Creating a new deposit for user');
    const result = await depositDao.save(ctxt, {
      ...deposit,
      initial: deposit.value,
    });
    return result;
  } catch (error) {
    log.error(`Error while creating new deposit for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { create };
