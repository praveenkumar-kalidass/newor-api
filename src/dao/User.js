const passwordHash = require('password-hash');

const model = require('../model');

const save = async (user) => {
  try {
    const result = await model.User.create({
      ...user,
      password: passwordHash.generate(user.password),
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  save,
};
