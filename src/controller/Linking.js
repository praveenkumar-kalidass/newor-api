const joi = require('joi');

const neworError = require('../constant/error');
const linkingSchema = require('../schema/Linking');
const { getInvalidLink } = require('../helper/template');
const constant = require('../constant');
const { appConfig: config } = require('../../config');
const logger = require('../helper/logger');

const linkingV1 = async (request, response) => {
  const log = await logger.init(null, request.originalUrl, {
    class: 'linking_controller',
    method: 'linkingV1',
  });
  try {
    log.info('Initiating linking v1 api.');
    await linkingSchema.linkingV1.validateAsync(request.params);
    response.redirect(`${constant.APP.DEEPLINKING_HOST}${request.params.path}/${request.params.token}`);
    log.info('Successfully redirected linking v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      log.error(`Error while validating linking v1 request. Error: ${error}`);
      const { BAD_REQUEST } = neworError;
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    log.error(`Error while trying linking v1 api. Error: ${error}`);
    response.format({
      html: () => {
        response.status(500).send(getInvalidLink({ baseURL: config.baseURL }));
      },
    });
  } finally {
    log.end();
  }
};

module.exports = { linkingV1 };
