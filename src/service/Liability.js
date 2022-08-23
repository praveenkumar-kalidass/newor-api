const neworError = require('../constant/error');
const liabilityDao = require('../dao/Liability');
const logger = require('../helper/logger');

const calculate = async (ctxt, userId) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_service',
    method: 'calculate',
  });
  try {
    log.info('Initiating calculation of liability for user');
    const liability = await liabilityDao.fetch(ctxt, { userId });
    log.info('Successfully completed calculation of liability for user');
    return {
      id: liability.id,
      value: 0.00,
    };
  } catch (error) {
    log.error(`Error while calculating liability for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { calculate };
