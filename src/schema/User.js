const joi = require('joi');

const signupV1 = joi.object({
  firstName: joi.string().max(25).required(),
  lastName: joi.string().max(25).required(),
  email: joi.string().max(50).email().required(),
  password: joi.string().alphanum().min(6).max(15)
    .required(),
});

const loginV1 = joi.object({
  email: joi.string().max(50).email().required(),
  password: joi.string().alphanum().min(6).max(15)
    .required(),
  client_id: joi.string().max(50).required(),
  response_type: joi.string().max(50).required(),
});

module.exports = {
  signupV1,
  loginV1,
};
