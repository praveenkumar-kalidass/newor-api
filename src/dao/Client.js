const model = require('../model');

const fetchBy = async (id) => {
  try {
    console.log('Fetching client from database');
    const result = await model.Client.findByPk(id);
    console.log('Successfully fetched client from database');
    return result;
  } catch (error) {
    console.error('Error while fetching client from database. Error: ', error);
    throw error;
  }
};

module.exports = {
  fetchBy,
};
