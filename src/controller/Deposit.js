const joi = require('joi');

const neworError = require('../constant/error');
const depositSchema = require('../schema/Deposit');
const depositService = require('../service/Deposit');
const logger = require('../helper/logger');

const postV1 = async (request, response) => {
  const log = await logger.init(null, request.originalUrl, {
    class: 'deposit_controller',
    method: 'postV1',
  });
  try {
    log.info('Initiating deposit post v1 api');
    log.info('Validating deposit request details');
    await depositSchema.postV1.validateAsync(request.body);
    log.info('Deposit request details are valid');
    const result = await depositService.create(request.body);
    log.info('Successfully completed deposit post v1 api');
    response.status(200).send(result);
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating deposit post v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while posting deposit for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

module.exports = { postV1 };
