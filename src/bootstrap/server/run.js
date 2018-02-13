const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const deepmerge = require('deepmerge');
const defaultConfig = require('./defaultConfig');
const registerBabel = require('../utils/registerBabel');
const paths = require('../../config/paths');

module.exports = function runServer(customConfig) {
  // babel registration (runtime transpilation for node)
  registerBabel();

  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  /* eslint-disable global-require */

  // define process.env.NODE_PATH for imports
  const { Module } = require('module');
  process.env.NODE_PATH = paths.appMain;
  // eslint-disable-next-line no-underscore-dangle
  Module._initPaths();

  // define app process.env constants
  process.env.APP_MODE = process.env.NODE_ENV;
  process.env.APP_ENV = 'server';
  process.env.APP_PLATFORM = 'web';

  // define webpackIsomorphicTools constant
  new WebpackIsomorphicTools(require('../../config/webpackIsomorphicTools')).server(
    paths.appRoot,
    () => {
      const createHttpServer = require('./createHttpServer');
      createHttpServer(config);
    }
  );
  /* eslint-enable */
};
