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
    if (!result) {
      console.log('No user found with email: ', user.email);
      throw neworError.USER_NOT_FOUND;
    }
    if (passwordHash.verify(user.password, result.password)) {
      console.log('Successfully verified user credentials.');
      delete result.password;
      return result;
    }
    console.log('User credentials verification failed.');
    throw neworError.INVALID_CREDENTIALS;
  } catch (error) {
    if (neworError.isNeworError(error)) {
      throw error;
    }
    console.error('Error while login user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
  login,
};
