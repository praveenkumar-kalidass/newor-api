const jwt = require('jsonwebtoken');

const { appConfig: config } = require('../../config');
const constant = require('../constant');
const neworError = require('../constant/error');

const getUser = (request) => (
  new Promise((resolve, reject) => {
    const idToken = request.get(constant.REQUEST.IDENTIFICATION_HEADER);
    if (!idToken) {
      reject(neworError.UNIDENTIFIED);
    }
    const user = jwt.decode(idToken, config.idTokenSecret);
    resolve(user);
  })
);

const getAccessToken = (request) => (
  new Promise((resolve, reject) => {
    const bearerToken = request.get(constant.REQUEST.AUTHORIZATION_HEADER);
    if (!bearerToken) {
      reject(neworError.UNAUTHENTICATED);
    }
    const matches = bearerToken.match(/Bearer\s(\S+)/);
    if (!matches) {
      reject(neworError.UNAUTHENTICATED);
    }
    resolve(matches[1]);
  })
);

module.exports = { getUser, getAccessToken };
