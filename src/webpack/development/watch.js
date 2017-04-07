const deepmerge = require('deepmerge');
const createHttpDevServer = require('./createHttpDevServer');
const defaultConfig = require('./defaultConfig');

module.exports = function watchDevelopmentWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // start server
  createHttpDevServer(config);
};
