const neworError = require('../constant/error');
const assetDao = require('../dao/Asset');
const logger = require('../helper/logger');

const calculate = async (ctxt, userId) => {
  const log = await logger.init(ctxt, null, {
    class: 'asset_service',
    method: 'calculate',
  });
  try {
    log.info('Initiating calculation of asset for user');
    const asset = await assetDao.fetch(ctxt, { userId });
    log.info('Successfully completed calculation of asset for user');
    return {
      id: asset.id,
      value: 0.00,
    };
  } catch (error) {
    log.error(`Error while calculating asset for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { calculate };
