const path = require('path');
const deepmerge = require('deepmerge');
const defaultConfig = require('./defaultConfig');
const registerBabel = require('../utils/registerBabel');
const paths = require('../../config/paths');

/* eslint-disable global-require */
module.exports = function runServer(customConfig) {
  // Babel registration (runtime transpilation for node)
  if (process.env.NODE_ENV === 'development') {
    registerBabel();
  }

  // Merge config
  const config = deepmerge(defaultConfig, customConfig);

  // Define process.env.NODE_PATH for imports
  const { Module } = require('module');
  process.env.NODE_PATH = paths.appMain;
  // eslint-disable-next-line no-underscore-dangle
  Module._initPaths();

  // Define app process.env constants
  process.env.APP_MODE = process.env.NODE_ENV;
  process.env.APP_ENV = 'server';
  process.env.APP_PLATFORM = 'web';

  // Define aliases, so that there is only one react and one react-dom instance in use.
  // https://github.com/facebook/react/issues/13991#issuecomment-463486871
  const { setAliases } = require('require-control');

  setAliases({
    react: path.join(paths.appNodeModules, 'react'),
    'react-dom': path.join(paths.appNodeModules, 'react-dom'),
  });

  const createHttpServer = require('./createHttpServer');
  createHttpServer(config);
};
/* eslint-enable */
