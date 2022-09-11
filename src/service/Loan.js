const liabilityDao = require('../dao/Liability');
const loanDao = require('../dao/Loan');
const neworError = require('../constant/error');
const constant = require('../constant');
const logger = require('../helper/logger');

const create = async (ctxt, loan) => {
  const log = logger.init(ctxt, null, {
    class: 'loan_service',
    method: 'create',
  });
  try {
    log.info('Creating a new loan for user');
    const result = await loanDao.save(ctxt, loan);
    log.info('Getting liability list for user');
    const liability = await liabilityDao.fetch(ctxt, { id: loan.liabilityId });
    if (!liability.list.includes(constant.LIABILITY_TYPE.LOAN)) {
      log.info('Appending loan in liability list of user');
      await liabilityDao.update(ctxt, { id: loan.liabilityId }, {
        list: [
          ...liability.list,
          constant.LIABILITY_TYPE.LOAN,
        ],
      });
    }
    return result;
  } catch (error) {
    log.error(`Error while creating new loan for user. Error: ${error}`);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = { create };
