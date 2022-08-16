const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-1' });

const sendMail = ({
  from,
  to,
  subject,
  html,
}) => new AWS.SES({
  apiVersion: '2010-12-01',
}).sendEmail({
  Source: from,
  Destination: {
    ToAddresses: [to],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: html,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: subject,
    },
  },
}).promise();

module.exports = { sendMail };
