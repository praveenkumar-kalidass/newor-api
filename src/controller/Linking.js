const linkingSchema = require('../schema/Linking');
const { getInvalidLink } = require('../helper/template');
const constant = require('../constant');
const { getAppConfig } = require('../../config');

const config = getAppConfig();

const linkingV1 = async (request, response) => {
  try {
    console.log('Initiating linking v1 api.');
    await linkingSchema.linkingV1.validateAsync(request.params);
    response.redirect(`${constant.APP.DEEPLINKING_HOST}${request.params.path}/${request.params.token}`);
    console.log('Successfully redirected linking v1 api.');
  } catch (error) {
    console.error('Error while trying linking v1 api. Error: ', error);
    response.format({
      html: () => {
        response.status(500).send(getInvalidLink({ baseURL: config.baseURL }));
      },
    });
  }
};

module.exports = { linkingV1 };
