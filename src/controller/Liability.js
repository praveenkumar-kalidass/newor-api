const joi = require('joi');

const neworError = require('../constant/error');
const liabilitySchema = require('../schema/Liability');
const liabilityService = require('../service/Liability');
const logger = require('../helper/logger');

const getV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'liability_controller',
    method: 'getV1',
  });
  try {
    log.info('Initiating liability get v1 api');
    log.info('Validating liability request details');
    await liabilitySchema.getV1.validateAsync(request.params);
    log.info('Liability request details are valid');
    const result = await liabilityService.calculate(log.context, {
      id: request.params.liabilityId,
    }, true);
    log.info('Successfully completed liability get v1 api');
    response.status(200).send(result);
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating liability get v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while getting liability for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

module.exports = { getV1 };
