const authTokenDao = require('../dao/AuthToken');
const neworError = require('../constant/error');

const persist = async (token, client, user) => {
  try {
    console.log('Persisting auth token with client and user data');
    const authToken = await authTokenDao.save({
      ...token,
      clientId: client.id,
      userId: user.id,
    });
    console.log('Successfully persisted auth token with client and user data');
    return {
      ...authToken,
      client,
      user,
    };
  } catch (error) {
    console.error('Error while persisting auth token. Error: ', error);
    throw neworError.INTERNAL_SERVER_ERROR;
  }
};

module.exports = {
  persist,
};
