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

const uploadFile = ({
  bucket,
  key,
  body,
}) => new AWS.S3({
  apiVersion: '2006-03-01',
}).upload({
  Bucket: bucket,
  Key: key,
  Body: body,
  ContentLength: Buffer.byteLength(body),
}).promise();

const getFile = ({
  bucket,
  key,
}) => new AWS.S3({
  apiVersion: '2006-03-01',
}).getObject({
  Bucket: bucket,
  Key: key,
}).promise();

module.exports = { sendMail, uploadFile, getFile };
