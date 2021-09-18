const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const defaultWebpackConfig = require('../../config/webpack-dev');
const validateDll = require('../utils/validateDll');
const installDll = require('../utils/installDll');

module.exports = function createHttpDevServer(config) {
  // create server
  const app = new Express();

  // modify webpack config
  const webpackConfig = mergeWebpackConfig(defaultWebpackConfig, config, true);

  // handle dll
  if (config.devBuild.dll) {
    if (validateDll()) {
      installDll(webpackConfig);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        '\x1b[33mDevelopment mode is not optimized. Update your webpack dll to optimize it.\x1b[0m',
      );
    }
  }

  // webpack compiler
  const compiler = webpack(webpackConfig);

  // build dev server config
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
  app.use(webpackDevMiddleware(compiler, devServerOptions));
  app.use(webpackHotMiddleware(compiler));

  // run server
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
