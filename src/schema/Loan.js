const joi = require('joi');

const postV1 = joi.object({
  type: joi.string().max(50).required(),
  interestRate: joi.number().required(),
  principal: joi.number(),
  value: joi.number().required(),
  lenderName: joi.string().max(50).required(),
  startedAt: joi.date().required(),
  closingAt: joi.date(),
  liabilityId: joi.string().max(50).required(),
});

module.exports = { postV1 };
