const joi = require('joi');

const userSchema = require('../schema/User');
const userService = require('../service/User');
const neworError = require('../constant/error');

const signupV1 = async (request, response) => {
  try {
    console.log('Initiating user signup v1 api.');
    await userSchema.signupV1.validateAsync(request.body);
    const result = await userService.signup(request.body);
    response.status(200).send(result);
    console.log('Successfully completed user signup v1 api.');
  } catch (error) {
    if (joi.isError(error)) {
      console.error('Error while validating user signup v1 request. Error: ', error);
      const { BAD_REQUEST } = neworError;
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    console.error('Error while trying signup v1 api. Error: ', error);
    response.status(error.status).send(error.data);
  }
};

module.exports = {
  signupV1,
};
