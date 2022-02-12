const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var http = require('http');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Get port from environment and store in Express.
 */
const port = parseInt(process.env.PORT || '3000');
app.set('port', port);
 
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
 
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', (error) => {
  const bind = 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const bind = 'Port ' + addr.port;
  console.log('Newor-api, Listening on ' + bind);
});

module.exports = app;
