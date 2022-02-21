const passwordHash = require('password-hash');

const model = require('../model');

const save = async (user) => {
  try {
    console.log('Saving user to database');
    const result = await model.User.create({
      ...user,
      password: passwordHash.generate(user.password),
    });
    console.log('Successfully saved user to database');
    return result;
  } catch (error) {
    console.error('Error while saving user to database. Error: ', error);
    throw error;
  }
};

module.exports = {
  save,
};
