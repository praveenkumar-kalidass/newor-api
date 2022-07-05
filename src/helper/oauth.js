const clientService = require('../service/Client');
const userService = require('../service/User');

const getModel = () => ({
  getClient: async (id, secret) => {
    try {
      const client = await clientService.authorize({ id, secret });
      return client;
    } catch (error) {
      return null;
    }
  },
  saveAuthorizationCode: (code) => code,
  getUser: async (email, password) => {
    try {
      const user = await userService.login({ email, password });
      return user;
    } catch (error) {
      return null;
    }
  },
  saveToken: (accessToken, client, user) => ({
    accessToken,
    client,
    user,
  }),
  getRefreshToken: (refreshToken) => ({
    refreshToken,
    client: {},
    user: {},
  }),
  revokeToken: () => true,
});

module.exports = {
  getModel,
};
