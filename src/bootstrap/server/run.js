const path = require('path');
const deepmerge = require('deepmerge');
const { addAliases } = require('module-alias');
const defaultConfig = require('./defaultConfig');
const paths = require('../../config/paths');

/* eslint-disable global-require */
module.exports = function runServer(customConfig) {
  // Merge config
  const config = deepmerge(defaultConfig, customConfig);

  // Define process.env.NODE_PATH for imports
  // const { Module } = require('module');
  // process.env.NODE_PATH = paths.appMain;
  // eslint-disable-next-line no-underscore-dangle
  // Module._initPaths();

  // Define app constants
  // eslint-disable-next-line no-underscore-dangle
  // global.__DEV__ = process.env.NODE_ENV;

  // Define aliases, so that there is only one react and one react-dom instance in use.
  // https://github.com/facebook/react/issues/13991#issuecomment-463486871
  addAliases({
    'react-native': path.join(paths.appNodeModules, 'react-native-web'),
    react: path.join(paths.appNodeModules, 'react'),
    'react-dom': path.join(paths.appNodeModules, 'react-dom'),
  });

  const createHttpServer = require('./createHttpServer');
  createHttpServer(config);
};
/* eslint-enable */
