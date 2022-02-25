const deepmerge = require('deepmerge');
const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfigServer = require('../config/webpack-dev-server');
const webpackConfigClient = require('../config/webpack-dev-client');

const defaultConfig = {
  host: 'localhost',
  port: 8080,
  devServer: {
    host: 'localhost',
    port: 8081,
  },
  ignore: {
    paths: [/node_modules/],
  },
};

module.exports = function watchDevelopmentWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // webpack compiler
  const compilerServer = webpack(webpackConfigServer(config));
  const compilerClient = webpack(webpackConfigClient(config));

  // watch server build
  compilerServer.watch(
    {
      aggregateTimeout: 300,
      poll: 300,
    },
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
  );

  // create server
  const app = new Express();

  // create dev server config
  const devServerOptions = {
    publicPath: `http://${config.devServer.host}:${config.devServer.port}/dist/`,
    headers: {
      // In development same origin policy does not matter, so allow all.
      'Access-Control-Allow-Origin': '*',
    },
    stats: {
      preset: 'none',
      errors: true,
      errorDetails: true,
      warnings: true,
      logging: 'warn',
    },
  };

  // use webpack dev and hot middleware
  app.use(webpackDevMiddleware(compilerClient, devServerOptions));
  app.use(webpackHotMiddleware(compilerClient));

  // watch client build
  app.listen(config.devServer.port, config.devServer.host, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      // eslint-disable-next-line no-console
      console.info(`\n~~> Webpack development server listening on port ${config.devServer.port}`);
    }
  });
};
