const model = require('../model');

const save = async (user) => {
  try {
    console.log('Saving user to database');
    const result = await model.User.create(user);
    console.log('Successfully saved user to database');
    return result;
  } catch (error) {
    console.error('Error while saving user to database. Error: ', error);
    throw error;
  }
};

const fetch = async (by) => {
  try {
    console.log('Fetching user from database');
    const result = await model.User.findOne({ where: by });
    console.log('Successfully fetched user from database');
    return result;
  } catch (error) {
    console.error('Error while fetching user from database. Error: ', error);
    throw error;
  }
};

module.exports = {
  save,
  fetch,
};
