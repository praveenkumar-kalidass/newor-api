const assetService = require('./Asset');
const liabilityService = require('./Liability');
const neworError = require('../constant/error');
const logger = require('../helper/logger');

const calculate = async (ctxt, userId) => {
  const log = await logger.init(ctxt, null, {
    class: 'worth_service',
    method: 'calculate',
  });
  try {
    log.info('Initiating calculation of net-worth');
    log.info('Getting liablility and asset details of user');
    const [liability, asset] = await Promise.all([
      liabilityService.calculate(ctxt, userId),
      assetService.calculate(ctxt, userId),
    ]);
    log.info('Successfully got liablility and asset details of user');
    log.info('Returning net-worth of user as response');
    return {
      value: liability.value + asset.value,
      liability,
      asset,
    };
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    logger.error(`Error while calculating net-worth. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { calculate };
