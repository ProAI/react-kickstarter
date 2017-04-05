const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const defaultWebpackConfig = require('../../config/webpack.dev');

module.exports = function createHttpDevServer(config) {
  // create server
  const app = new Express();

  // modify webpack config
  const webpackConfig = mergeWebpackConfig(defaultWebpackConfig, config, true);

  // webpack compiler
  const compiler = webpack(webpackConfig);

  // build dev server config
  const devServerConfig = {
    host: config.devServer.host,
    port: config.devServer.port,
    contentBase: 'http://' + config.devServer.host + ':' + config.devServer.port,
    publicPath: 'http://' + config.devServer.host + ':' + config.devServer.port + '/dist/',
    compress: true,
    clientLogLevel: 'none',
    watchContentBase: true,
    hot: true,
    quiet: true,
    // See https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
  };

  // use webpack dev and hot middleware
  app.use(webpackDevMiddleware(compiler, devServerConfig));
  app.use(webpackHotMiddleware(compiler));

  // run server
  app.listen(config.devServer.port, config.devServer.host, function onAppListening(err) {
    if (err) {
      console.error(err);
    } else {
      console.info('==> 🚧  Webpack development server listening on port %s', config.devServer.port);
    }
  });
}