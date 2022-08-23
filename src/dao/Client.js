const model = require('../model');
const logger = require('../helper/logger');

const fetchBy = async (ctxt, id) => {
  const log = logger.init(ctxt, null, {
    class: 'client_dao',
    method: 'fetchBy',
  });
  try {
    log.info('Fetching client from database');
    const result = await model.Client.findByPk(id);
    if (!result) return result;
    log.info('Successfully fetched client from database');
    return result.dataValues;
  } catch (error) {
    log.error(`Error while fetching client from database. Error: ${error}`);
    throw error;
  }
};

module.exports = {
  fetchBy,
};
