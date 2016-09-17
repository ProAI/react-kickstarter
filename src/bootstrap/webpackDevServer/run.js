#!/usr/bin/env node

var bootstrapHttpServer = require('./bootstrapHttpDevServer');
var defaultConfig = require('./configDevServer');

module.exports = function runServer(customConfig) {
  // merge config
  var config = deepmerge(defaultConfig, customConfig);

  // add contentBase and publicPath to config
  config.server.contentBase = 'http://' + config.host + ':' + config.port;
  config.server.publicPath = config.webpack.output.publicPath;

  // start server
  bootstrapHttpDevServer(config);
};
