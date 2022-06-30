const passwordHash = require('password-hash');

const userDao = require('../dao/User');
const neworError = require('../constant/error');

const signup = async (user) => {
  try {
    console.log('Initiating signup user.');
    const result = await userDao.save({
      ...user,
      password: passwordHash.generate(user.password),
    });
    console.log('Successfully signed up user.');
    return result;
  } catch (error) {
    console.error('Error while signing up user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

const login = async (user) => {
  try {
    console.log('Initiating login user.');
    const result = await userDao.fetch({ email: user.email });
    if (passwordHash.verify(user.password, result.dataValues.password)) {
      console.log('Successfully verified user credentials.');
      return result.dataValues;
    }
    throw neworError.UNAUTHORIZED;
  } catch (error) {
    console.error('Error while login user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
  login,
};
