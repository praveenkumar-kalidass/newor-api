const http = require('http');
const OAuthServer = require('oauth2-server');
const jwt = require('jsonwebtoken');
const opentelemetry = require('@opentelemetry/api');

const { appConfig: config } = require('../../config');
const constant = require('../constant');
const neworError = require('../constant/error');
const oAuth = require('./oauth');
const tracing = require('./tracing')(constant.APP.SERVICE_NAME);

const httpMiddleware = (request, response, next) => {
  tracing.startActiveSpan(request.originalUrl, {
    kind: 1,
    attributes: {
      'http.host': request.hostname,
      'http.method': request.method,
      'http.target': request.originalUrl,
      'http.secure': request.secure,
    },
  }, (span) => {
    const actualResponse = { end: response.end };
    response.end = (...args) => {
      span.setStatus({
        code: response.statusCode >= 400 ? 2 : 1,
      });
      span.setAttributes({
        'http.status_code': response.statusCode,
        'http.status_text': http.STATUS_CODES[response.statusCode],
      });
      span.end();
      return actualResponse.end.apply(response, args);
    };
    next();
  });
};

const requestResponseMiddleware = (request, response, next) => {
  const span = tracing.startSpan(`${request.originalUrl} | request/response`, {
    kind: 1,
    attributes: {
      method: request.method,
    },
    root: false,
  }, opentelemetry.context.active());
  const requestLog = request.method !== 'GET' ? request.body : request.params;
  span.addEvent('Request', { request: JSON.stringify(requestLog) });

  const actualResponse = { write: response.write, end: response.end };
  const chunks = [];

  response.write = (chunk, ...args) => {
    if (typeof chunk !== 'string') {
      chunks.push(chunk);
    }
    return actualResponse.write.apply(response, args);
  };
  response.end = (chunk, ...args) => {
    let responseLog = chunk;
    if (typeof chunk !== 'string') {
      if (chunk) {
        chunks.push(chunk);
      }
      responseLog = Buffer.concat(chunks).toString('utf8');
    }
    span.setStatus({
      code: response.statusCode >= 400 ? 2 : 1,
    });
    span.addEvent('Response', { response: responseLog });
    span.end();
    return actualResponse.end.apply(response, [chunk, ...args]);
  };
  next();
};

const authMiddleware = async (request, response, next) => {
  const span = tracing.startSpan(`${request.originalUrl} | auth`, { kind: 1 }, opentelemetry.context.active());
  try {
    const idToken = request.get(constant.REQUEST.IDENTIFICATION_HEADER);
    if (!idToken) {
      span.addEvent('Identification not found!');
      throw neworError.UNIDENTIFIED;
    }
    const isVerified = jwt.verify(idToken, config.idTokenSecret);
    if (!isVerified) {
      span.addEvent('Identification not valid!');
      throw neworError.UNAUTHENTICATED;
    }
    span.addEvent('Identification Success!');
    const { email, mobileNumber } = jwt.decode(idToken, config.idTokenSecret);
    span.setAttributes({
      'user.email': email,
      'user.mobileNumber': mobileNumber,
    });
    const oauthRequest = new OAuthServer.Request(request);
    const oauthResponse = new OAuthServer.Response(request);
    await oAuth.authenticate(oauthRequest, oauthResponse, {});
    span.addEvent('Authentication Success!');
    next();
  } catch (error) {
    if (neworError.isNeworError(error)) {
      response.status(error.status).send(error.data);
      return;
    }
    span.addEvent(`Authentication failed!. Error: ${error}`);
    response.status(neworError.UNAUTHENTICATED.status).send(neworError.UNAUTHENTICATED.data);
  } finally {
    span.end();
  }
};

module.exports = { httpMiddleware, requestResponseMiddleware, authMiddleware };
