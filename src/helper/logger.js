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
  logger.info(message, this.tags);
  const span = opentelemetry.trace.getSpan(this.context);
  span.addEvent('info', { ...this.tags, message });
}

function error(message) {
  logger.error(message, this.tags);
  const span = opentelemetry.trace.getSpan(this.context);
  span.addEvent('error', { ...this.tags, message });
}

function end() {
  const span = opentelemetry.trace.getSpan(this.context);
  span.end();
}

const init = (ctxt, url, tags) => (
  new Promise((resolve) => {
    if (!ctxt) {
      tracing.startActiveSpan(`${url} | log`, () => {
        resolve({
          context: opentelemetry.context.active(),
          tags,
          info,
          error,
          end,
        });
      });
      return;
    }
    resolve({
      ctxt,
      tags,
      info,
      error,
      end,
    });
  })
);

module.exports = { init };
