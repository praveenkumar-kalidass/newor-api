const http = require('http');

const constant = require('../constant');
const tracing = require('./tracing')(constant.APP.SERVICE_NAME);

const traceStatusCode = {
  200: 1,
  307: 1,
};

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
    response.end = (chunk, ...args) => {
      span.setStatus({
        code: traceStatusCode[response.statusCode] || 2,
      });
      span.setAttributes({
        'http.status_code': response.statusCode,
        'http.status_text': http.STATUS_CODES[response.statusCode],
      });
      span.end();
      return actualResponse.end.apply(response, [chunk, ...args]);
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
  });

  const requestLog = request.method !== 'GET' ? request.body : request.params;
  span.addEvent('Request', { request: JSON.stringify(requestLog) });

  const actualResponse = { write: response.write, end: response.end, send: response.send };
  const chunks = [];

  response.write = (chunk, ...args) => {
    chunks.push(chunk);
    return actualResponse.write.apply(response, args);
  };
  response.end = (chunk, ...args) => {
    if (chunk) {
      chunks.push(chunk);
    }
    const responseLog = Buffer.concat(chunks).toString('utf8');
    span.setStatus({
      code: traceStatusCode[response.statusCode] || 2,
    });
    span.addEvent('Response', { response: responseLog });
    span.end();
    return actualResponse.end.apply(response, [chunk, ...args]);
  };
  next();
};

module.exports = { httpMiddleware, requestResponseMiddleware };
