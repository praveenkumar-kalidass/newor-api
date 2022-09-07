const model = require('../model');
const logger = require('../helper/logger');

const getAll = async (ctxt, by, attributes) => {
  const log = logger.init(ctxt, null, {
    class: 'loan_dao',
    method: 'getAll',
  });
  try {
    log.info('Getting all loans from database');
    const result = await model.Loan.findAll({
      where: by,
      attributes,
      order: [['created_at', 'DESC']],
    });
    log.info(`Successfully got #${result.length} loans from database`);
    return result.map((loan) => loan.dataValues);
  } catch (error) {
    log.error(`Error while getting loans from database. Error: ${error}`);
    throw error;
  }
};

module.exports = { getAll };
