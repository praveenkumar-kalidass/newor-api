const constant = require('../constant');
const neworError = require('../constant/error');
const liabilityDao = require('../dao/Liability');
const loanDao = require('../dao/Loan');
const logger = require('../helper/logger');

const fetchAll = async (ctxt, liabilityId, liabilities, details) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_service',
    method: 'fetchAll',
  });
  try {
    const getter = {
      [constant.LIABILITY_TYPE.LOAN]: loanDao.getAll(ctxt, { liabilityId }, details),
    };
    const result = await Promise.all(liabilities.map((liability) => getter[liability]));
    return result.flat();
  } catch (error) {
    log.error(`Error while fetching liability for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const calculate = async (ctxt, by, isDetailed = false) => {
  const log = logger.init(ctxt, null, {
    class: 'liability_service',
    method: 'calculate',
  });
  try {
    log.info('Initiating calculation of liability for user');
    const liability = await liabilityDao.fetch(ctxt, by);
    log.info('Successfully completed calculation of liability for user');
    const details = isDetailed ? ['value', 'lenderName', 'type'] : ['value'];
    const liabilities = await fetchAll(ctxt, liability.id, liability.list, details);
    return {
      id: liability.id,
      value: liabilities.reduce((total, current) => total + current.value, 0),
      ...(isDetailed && {
        list: liabilities,
      }),
    };
  } catch (error) {
    log.error(`Error while calculating liability for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { calculate };
