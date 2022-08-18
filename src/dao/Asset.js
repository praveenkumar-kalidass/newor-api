const model = require('../model');
const logger = require('../helper/logger');

const init = async (ctxt, asset) => {
  const log = await logger.init(ctxt, null, {
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

module.exports = { init };
