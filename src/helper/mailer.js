const nodemailer = require('nodemailer');

const { appConfig } = require('../../config');

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
