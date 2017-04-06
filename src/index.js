const runServer = require('./bootstrap/server/run');
const watchDevelopmentWebpack = require('./webpack/development/watch');
const buildProductionWebpack = require('./webpack/production/build');

module.exports = {
  runServer,
  watchDevelopmentWebpack,
  buildProductionWebpack
}
