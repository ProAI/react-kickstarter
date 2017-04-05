const createHttpDevServer = require('./createHttpDevServer');
const defaultConfig = require('./defaultConfig');
const deepmerge = require('deepmerge');

module.exports = function runDevServer(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // start server
  createHttpDevServer(config);
};
