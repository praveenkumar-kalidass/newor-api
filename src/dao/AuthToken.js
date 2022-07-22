const model = require('../model');

const save = async (token) => {
  try {
    console.log('Saving auth token to database');
    const result = await model.AuthToken.create(token);
    console.log('Successfully saved auth token to database');
    return result.dataValues;
  } catch (error) {
    console.error('Error while saving auth token to database. Error: ', error);
    throw error;
  }
};

module.exports = {
  save,
};
