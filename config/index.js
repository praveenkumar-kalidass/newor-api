const sequelize = require('./database.json');
const config = require('./config.json');

module.exports = {
  databaseConfig: sequelize[process.env.ENV],
  appConfig: config,
};
