const joi = require('joi');

const neworError = require('../constant/error');
const loanSchema = require('../schema/Loan');
const loanService = require('../service/Loan');
const logger = require('../helper/logger');

const postV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'loan_controller',
    method: 'postV1',
  });
  try {
    log.info('Initiating loan post v1 api');
    log.info('Validating loan request details');
    await loanSchema.postV1.validateAsync(request.body);
    log.info('Loan request details are valid');
    const result = await loanService.create(log.context, request.body);
    log.info('Successfully completed loan post v1 api');
    response.status(200).send(result);
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating loan post v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while posting loan for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

module.exports = { postV1 };
