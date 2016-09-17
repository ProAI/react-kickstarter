#!/usr/bin/env node

var deepmerge = require('deepmerge');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var bootstrapHttpServer = require('./bootstrapHttpServer');
var defaultConfig = require('./configServer');
var registerBabel = require('./helpers/registerBabel');

module.exports = function runServer(customConfig) {
  // merge config
  var config = deepmerge(defaultConfig, customConfig);

  // babel registration (runtime transpilation for node)
  registerBabel(config.babel);

  // define isomorphic constants
  global.__CLIENT__ = false;
  global.__SERVER__ = true;
  global.__DISABLE_SSR__ = config.isomorphic.enable;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
  global.__DEVELOPMENT__ = config.env !== 'production';
  global.__DLLS__ = config.app.includeDlls;
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(config.isomorphic.config)
    .development(__DEVELOPMENT__)
    .server(config.root, function() {
      bootstrapHttpServer(config);
    });
};
