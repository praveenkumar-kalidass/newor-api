const constant = require('../constant');
const neworError = require('../constant/error');
const assetDao = require('../dao/Asset');
const depositDao = require('../dao/Deposit');
const logger = require('../helper/logger');

const fetchAll = async (ctxt, assetId, assets, details) => {
  const log = logger.init(ctxt, null, {
    class: 'asset_service',
    method: 'fetchAll',
  });
  try {
    const getter = {
      [constant.ASSET_TYPE.DEPOSIT]: depositDao.getAll(ctxt, { assetId }, details),
    };
    const result = await Promise.all(assets.map((asset) => getter[asset]));
    return result.flat();
  } catch (error) {
    log.error(`Error while calculating asset for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const calculate = async (ctxt, by, isDetailed = false) => {
  const log = logger.init(ctxt, null, {
    class: 'asset_service',
    method: 'calculate',
  });
  try {
    log.info('Initiating calculation of asset for user');
    const asset = await assetDao.fetch(ctxt, by);
    log.info('Successfully completed calculation of asset for user');
    const details = isDetailed ? ['value', 'depositoryName', 'type'] : ['value'];
    const assets = await fetchAll(ctxt, asset.id, asset.list, details);
    return {
      id: asset.id,
      value: assets.reduce((total, current) => total + current.value, 0),
      ...(isDetailed && {
        list: assets,
      }),
    };
  } catch (error) {
    log.error(`Error while calculating asset for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { calculate };
