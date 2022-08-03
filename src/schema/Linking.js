const joi = require('joi');

const linkingV1 = joi.object({
  path: joi.string().required(),
  token: joi.string().required(),
});

module.exports = { linkingV1 };
