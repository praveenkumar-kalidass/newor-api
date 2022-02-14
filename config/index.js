const sequelize = require('./sequelize.json');
const config = require('./config.json');
const database = sequelize[config.env];

const getDatabaseConfig = () => ({
  username: database.username,
  password: database.password,
  name: database.name,
  host: database.host,
  dialect: database.dialect,
});

module.exports = { getDatabaseConfig };
