const neworError = require('../constant/error');
const linkingSchema = require('../schema/Linking');
const constant = require('../constant');
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
    log.error(`Error while validating linking v1 request. Error: ${error}`);
    const { BAD_REQUEST } = neworError;
    response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
  } finally {
    log.end();
  }
};

module.exports = { linkingV1 };
