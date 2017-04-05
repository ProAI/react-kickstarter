const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const defaultConfig = require('./defaultConfig');
const deepmerge = require('deepmerge');

module.exports = function runServer(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // define process.env constants
  process.env.APP_MODE = process.env.NODE_ENV;
  process.env.APP_ENV = 'server';
  process.env.APP_PLATFORM = 'web';

  // define webpackIsomorphicTools constant
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../config/webpack-isomorphic-tools'))
    .server(config.root, function() {
      const createHttpServer = require('./createHttpServer');
      createHttpServer(config);
    });
};
