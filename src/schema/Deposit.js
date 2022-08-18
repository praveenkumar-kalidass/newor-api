const joi = require('joi');

const postV1 = joi.object({
  type: joi.string().max(20).required(),
  interestRate: joi.number().required(),
  value: joi.number().required(),
  depositoryName: joi.string().max(50).required(),
  startedAt: joi.date().required(),
  maturityAt: joi.date(),
  assetId: joi.string().max(50).required(),
});

module.exports = { postV1 };
