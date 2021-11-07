const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../config/webpack-dev');

module.exports = function createHttpDevServer(config) {
  // create server
  const app = new Express();

  // webpack compiler
  const compiler = webpack(webpackConfig(config));

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
