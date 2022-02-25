const runServer = require('./bootstrap/server/run');
const watchDevelopmentWebpack = require('./webpack/watchDevelopmentWebpack');
const buildProductionWebpack = require('./webpack/buildProductionWebpack');

module.exports = {
  runServer,
  watchDevelopmentWebpack,
  buildProductionWebpack,
};
