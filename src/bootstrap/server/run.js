const path = require('path');
const deepmerge = require('deepmerge');
const { addAliases } = require('module-alias');
const defaultConfig = require('./defaultConfig');
const paths = require('../../config/paths');

module.exports = function run(customConfig) {
  // Merge config
  const config = deepmerge(defaultConfig, customConfig);

  // Define aliases, so that there is only one react and one react-dom instance in use.
  // https://github.com/facebook/react/issues/13991#issuecomment-463486871
  addAliases({
    'react-native': path.join(paths.appNodeModules, 'react-native-web'),
    react: path.join(paths.appNodeModules, 'react'),
    'react-dom': path.join(paths.appNodeModules, 'react-dom'),
  });

  // eslint-disable-next-line global-require
  const createHttpServer = require('./createHttpServer');
  createHttpServer(config);
};
