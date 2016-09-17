var Express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function bootstrapHttpDevServer(config) {
  // create server
  var app = new Express();

  // webpack compiler
  var compiler = webpack(config.webpack);

  // use webpack dev and hot middleware
  app.use(webpackDevMiddleware(compiler, config.server));
  app.use(webpackHotMiddleware(compiler));

  // run server
  app.listen(config.port, config.host, function onAppListening(err) {
    if (err) {
      console.error(err);
    } else {
      console.info('==> 🚧  Webpack development server listening on port %s', config.port);
    }
  });
}