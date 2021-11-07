const deepmerge = require('deepmerge');
const createHttpDevServer = require('./createHttpDevServer');

const defaultConfig = {
  host: 'localhost',
  port: 8080,
  styles: {
    main: null,
    desktop: null,
    mobile: null,
  },
  devServer: {
    host: 'localhost',
    port: 8081,
  },
  devBuild: {
    dll: false,
  },
};

module.exports = function watchDevelopmentWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // start server
  createHttpDevServer(config);
};
