const userDao = require('../dao/User');
const neworError = require('../constant/error');

const signup = async (user) => {
  try {
    console.log('Initiating signup user.');
    const result = await userDao.save(user);
    console.log('Successfully signed up user.');
    return result;
  } catch (error) {
    console.error('Error while signing up user. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
};
