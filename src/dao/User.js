const model = require('../model');

const save = async (user) => {
  try {
    console.log('Saving user to database');
    const result = await model.User.create(user);
    console.log('Successfully saved user to database');
    delete result.dataValues.password;
    return result.dataValues;
  } catch (error) {
    console.error('Error while saving user to database. Error: ', error);
    throw error;
  }
};

const fetch = async (by) => {
  try {
    console.log('Fetching user from database');
    const result = await model.User.findOne({ where: by });
    if (!result) return result;
    console.log('Successfully fetched user from database');
    return result.dataValues;
  } catch (error) {
    console.error('Error while fetching user from database. Error: ', error);
    throw error;
  }
};

const update = async (by, user) => {
  try {
    console.log('Updating user in database');
    const result = await model.User.update(user, { where: by });
    if (!result) return result;
    console.log('Successfully updated user in database');
    return result.dataValues;
  } catch (error) {
    console.error('Error while updating user from database. Error: ', error);
    throw error;
  }
};

module.exports = {
  save,
  fetch,
  update,
};
