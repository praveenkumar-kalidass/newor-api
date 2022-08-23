const opentelemetry = require('@opentelemetry/api');
const winston = require('winston');

const constant = require('../constant');
const tracing = require('./tracing')(constant.APP.SERVICE_NAME);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

function info(message) {
  const span = this.context;
  const { traceId, spanId } = span.spanContext();
  logger.info(message, { ...this.tags, traceId, spanId });
  span.addEvent('info', { ...this.tags, message });
}

function error(message) {
  const span = this.context;
  const { traceId, spanId } = span.spanContext();
  logger.error(message, { ...this.tags, traceId, spanId });
  span.addEvent('error', { ...this.tags, message });
}

function end() {
  this.context.end();
}

const init = (ctxt, url, tags) => {
  if (!ctxt) {
    const span = tracing.startSpan(`${url} | log`, { kind: 1 }, opentelemetry.context.active());
    return {
      context: span,
      tags,
      info,
      error,
      end,
    };
  }
  return {
    context: ctxt,
    tags,
    info,
    error,
    end,
  };
};

module.exports = { init };
