const sequelize = require('./database.json');
const config = require('./config.json');

const database = sequelize[process.env.ENV];

const getDatabaseConfig = () => ({
  username: database.username,
  password: database.password,
  database: database.database,
  host: database.host,
  dialect: database.dialect,
});

const getAppConfig = () => ({
  baseURL: config.base_url,
  emailVerificationTokenSecret: config.email_verification_token_secret,
  smtpEndpoint: config.smtp_endpoint,
  smtpUsername: config.smtp_user_name,
  smtpPassword: config.smtp_password,
  emailId: config.email_id,
});

module.exports = { getDatabaseConfig, getAppConfig };
