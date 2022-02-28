const sequelize = require('./database.json');

const database = sequelize[process.env.ENV];

const getDatabaseConfig = () => ({
  username: database.username,
  password: database.password,
  database: database.database,
  host: database.host,
  dialect: database.dialect,
});

module.exports = { getDatabaseConfig };
