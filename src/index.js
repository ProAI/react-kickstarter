const runServer = require('./bootstrap/server/run');
const watchDevelopmentWebpack = require('./webpack/development/watch');
const buildProductionWebpack = require('./webpack/production/build');
const registerBabel = require('./bootstrap/utils/registerBabel');
const babelConfig = require('./config/babel');

// babel registration (runtime transpilation for node)
registerBabel(babelConfig);

module.exports = {
  runServer,
  watchDevelopmentWebpack,
  buildProductionWebpack
}
