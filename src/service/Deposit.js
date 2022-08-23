const assetDao = require('../dao/Asset');
const depositDao = require('../dao/Deposit');
const neworError = require('../constant/error');
const constant = require('../constant');
const logger = require('../helper/logger');

const create = async (ctxt, deposit) => {
  const log = logger.init(ctxt, null, {
    class: 'client_service',
    method: 'authorize',
  });
  try {
    log.info('Creating a new deposit for user');
    const result = await depositDao.save(ctxt, deposit);
    log.info('Getting asset list for user');
    const asset = await assetDao.fetch(ctxt, { id: deposit.assetId });
    if (!asset.list.includes(constant.ASSET_TYPE.DEPOSIT)) {
      log.info('Appending deposit is asset list of user');
      await assetDao.update(ctxt, { id: deposit.assetId }, {
        list: [
          ...asset.list,
          constant.ASSET_TYPE.DEPOSIT,
        ],
      });
    }
    return result;
  } catch (error) {
    log.error(`Error while creating new deposit for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { create };
