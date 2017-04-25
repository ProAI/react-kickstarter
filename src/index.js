const runServer = require('./bootstrap/server/run');
const watchDevelopmentWebpack = require('./webpack/development/watch');
const buildDllWebpack = require('./webpack/dll/build');
const buildProductionWebpack = require('./webpack/production/build');

module.exports = {
  runServer,
  watchDevelopmentWebpack,
  buildDllWebpack,
  buildProductionWebpack,
};
