const model = require('../model');
const logger = require('../helper/logger');

const init = async (ctxt, asset) => {
  const log = logger.init(ctxt, null, {
    class: 'asset_dao',
    method: 'init',
  });
  try {
    log.info('Initiating asset in database');
    const result = await model.Asset.create(asset);
    log.info('Successfully initiated asset in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while initiating asset in database. Error: ${error}`);
    throw error;
  }
};

const fetch = async (ctxt, by) => {
  const log = logger.init(ctxt, null, {
    class: 'asset_dao',
    method: 'fetch',
  });
  try {
    log.info('Fetching asset from database');
    const result = await model.Asset.findOne({
      where: by,
    });
    log.info('Successfully fetched asset from database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while fetching asset from database. Error: ${error}`);
    throw error;
  }
};

const update = async (ctxt, by, asset) => {
  const log = logger.init(ctxt, null, {
    class: 'asset_dao',
    method: 'update',
  });
  try {
    log.info('Updating asset in database');
    const result = await model.Asset.update(asset, { where: by });
    if (!result) return result;
    log.info('Successfully updated asset in database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while updating asset in database. Error: ${error}`);
    throw error;
  }
};

module.exports = { init, fetch, update };
