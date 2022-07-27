const nodemailer = require('nodemailer');

const { getAppConfig } = require('../../config');

const appConfig = getAppConfig();

const mailer = nodemailer.createTransport({
  host: appConfig.smtpEndpoint,
  port: 465,
  secure: true,
  auth: {
    user: appConfig.smtpUsername,
    pass: appConfig.smtpPassword,
  },
});

module.exports = mailer;
