const joi = require('joi');

const userSchema = require('../schema/User');
const userService = require('../service/User');
const neworError = require('../constant/error');

const signupV1 = async (request, response) => {
  try {
    await userSchema.signupV1.validateAsync(request.body);
    const result = await userService.signup(request.body);
    response.status(200).send(result);
  } catch (error) {
    if (joi.isError(error)) {
      const { BAD_REQUEST } = neworError;
      response.status(BAD_REQUEST.status).send(BAD_REQUEST.data);
      return;
    }
    response.status(error.status).send(error.data);
  }
};

module.exports = {
  signupV1,
};
