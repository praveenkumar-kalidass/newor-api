const joi = require('joi');

const getV1 = joi.object({
  assetId: joi.string().max(50).required(),
});

module.exports = { getV1 };
