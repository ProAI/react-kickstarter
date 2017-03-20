#!/usr/bin/env node

var deepmerge = require('deepmerge');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var defaultConfig = require('./defaultConfig');
var deepmerge = require('deepmerge');

module.exports = function runServer(customConfig) {
  // merge config
  var config = deepmerge(defaultConfig, customConfig);

  // define isomorphic constants
  global.__CLIENT__ = false;
  global.__SERVER__ = true;
  global.__DISABLE_SSR__ = config.isomorphic.enable;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
  global.__DEVELOPMENT__ = config.env !== 'production';
  global.__DLLS__ = config.app.includeDlls;
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../config/webpack-isomorphic-tools'))
    .development(__DEVELOPMENT__)
    .server(config.root, function() {
      var createHttpServer = require('./createHttpServer');
      createHttpServer(config);
    });
};
