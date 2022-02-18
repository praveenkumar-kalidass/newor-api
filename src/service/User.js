const userDao = require('../dao/User');
const neworError = require('../constant/error');

const signup = async (user) => {
  try {
    const result = await userDao.save(user);
    return result;
  } catch (error) {
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  signup,
};
