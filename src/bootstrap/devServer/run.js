var createHttpServer = require('./createHttpServer');
var defaultConfig = require('./defaultConfig');
var deepmerge = require('deepmerge');

module.exports = function runDevServer(customConfig) {
  // merge config
  var config = deepmerge(defaultConfig, customConfig);

  // add contentBase and publicPath to config
  config.server.contentBase = 'http://' + config.host + ':' + config.port;
  config.server.publicPath = 'http://' + config.host + ':' + config.port + '/dist/';

  // start server
  createHttpServer(config);
};
