const Express = require('express');
const http = require('http');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const createProxy = require('../utils/createProxy');
const createReactAppOnServer = require('./createReactAppOnServer');
const paths = require('../../config/paths');

module.exports = function createHttpServer(config) {
  // create server
  const app = new Express();
  const server = new http.Server(app);

  // proxy middleware
  config.proxies.forEach(proxy => {
    app.use(proxy.path, createProxy(proxy, server));
  });

  // compression middleware
  app.use(compression());

  // favicon middleware
  if (config.favicon) {
    app.use(favicon(paths.appFavicon));
  }

  // cookies middleware
  if (config.cookies) {
    app.use(cookieParser());
  }

  // static directory middleware
  app.use(Express.static(paths.appPublic));

  // initialize app middleware
  app.use(createReactAppOnServer(config));

  // start server
  if (config.port && config.host) {
    server.listen(config.port, config.host, err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      // eslint-disable-next-line no-console
      console.info(
        '\n~~> Node.js server is running.\n    Open',
        `\x1b[93mhttp://localhost:${config.port}\x1b[0m`,
        'in a browser to view the app.\n'
      );
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('ERROR: No PORT or HOST config variable has been specified');
  }
};
