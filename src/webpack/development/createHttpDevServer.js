const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const defaultWebpackConfig = require('../../config/webpack.dev');
const validateDll = require('../utils/validateDll.js');
const installDll = require('../utils/installDll.js');

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
        'Webpack: Dll is not valid. Maybe you have to rebuild the dll with npm run build-dll.'
      );
    }
  }

  // webpack compiler
  const compiler = webpack(webpackConfig);

  // build dev server config
  const devServerOptions = {
    host: config.devServer.host,
    port: config.devServer.port,
    contentBase: `http://${config.devServer.host}:${config.devServer.port}`,
    publicPath: `http://${config.devServer.host}:${config.devServer.port}/dist/`,
    hot: true,
    quiet: true,
    noInfo: true,
    inline: true,
    lazy: false,
  };

  // use webpack dev and hot middleware
  app.use(webpackDevMiddleware(compiler, devServerOptions));
  app.use(webpackHotMiddleware(compiler));

  // run server
  app.listen(config.devServer.port, config.devServer.host, err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      // eslint-disable-next-line no-console
      console.info(`\n~~> Webpack development server listening on port ${config.devServer.port}`);
    }
  });
};
