const joi = require('joi');

const neworError = require('../constant/error');
const assetSchema = require('../schema/Asset');
const assetService = require('../service/Asset');
const logger = require('../helper/logger');

const getV1 = async (request, response) => {
  const log = logger.init(null, request.originalUrl, {
    class: 'asset_controller',
    method: 'getV1',
  });
  try {
    log.info('Initiating asset get v1 api');
    log.info('Validating asset request details');
    await assetSchema.getV1.validateAsync(request.params);
    log.info('Asset request details are valid');
    const result = await assetService.calculate(log.context, {
      id: request.params.assetId,
    }, true);
    log.info('Successfully completed asset get v1 api');
    response.status(200).send(result);
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      log.error(`Error while validating asset get v1 request. Error: ${error}`);
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while getting asset for user. Error: ${JSON.stringify(error)}`);
    response.status(error.status).send(error.data);
  } finally {
    log.end();
  }
};

module.exports = { getV1 };
