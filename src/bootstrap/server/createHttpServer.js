const Express = require('express');
const http = require('http');
const compression = require('compression');
const createProxy = require('../utils/createProxy');
const createReactAppOnServer = require('./createReactAppOnServer');
const paths = require('../../config/paths');

module.exports = function createHttpServer(config) {
  // create server
  const app = new Express();
  const server = new http.Server(app);

  // proxy middleware
  config.proxies.forEach((proxy) => {
    app.use(proxy.path, createProxy(proxy, server));
  });

  // compression middleware
  app.use(compression());

  // static directory middleware
  app.use(Express.static(paths.appPublic));

  // initialize app middleware
  app.use(createReactAppOnServer(config));

  // start server
  if (config.port && config.host) {
    server.listen(config.port, config.host, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      if (process.env.APP_MODE === 'development') {
        // eslint-disable-next-line no-console
        console.info(
          '\n~~> Node.js server is running.\n    Open',
          `\x1b[36mhttp://localhost:${config.port}\x1b[0m`,
          'in a browser after webpack has been built.\n',
        );
        // eslint-disable-next-line no-console
        console.info('Please wait, webpack is building...\n');
      } else {
        // eslint-disable-next-line no-console
        console.info(
          '\n~~> Node.js server is running.\n    Open',
          `\x1b[36mhttp://localhost:${config.port}\x1b[0m`,
          'in a browser to view the app.\n',
        );
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('ERROR: No PORT or HOST config variable has been specified');
  }
};
