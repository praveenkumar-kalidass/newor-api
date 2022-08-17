const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const swagger = require('swagger-ui-express');
const swaggerDoc = require('swagger-jsdoc');
const path = require('path');
const fileUpload = require('express-fileupload');

const swaggerConfig = require('./config/swagger.json');
const router = require('./src/route');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

/**
 * Get port from environment and store in Express.
 */
const port = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

app.use('/docs', swagger.serve, swagger.setup(swaggerDoc(swaggerConfig)));
app.use('/api', router);
app.use('/public', express.static(path.join(__dirname, 'public')));

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', (error) => {
  const bind = `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const bind = `Port ${addr.port}`;
  console.log(`Newor-api, Listening on ${bind}`);
});

module.exports = app;
