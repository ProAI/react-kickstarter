var runServer = require('./bootstrap/server/run');
var runWebpackDevServer = require('./bootstrap/devServer/run');
var registerBabel = require('./bootstrap/utils/registerBabel');
var babelConfig = require('./config/babel');

// babel registration (runtime transpilation for node)
registerBabel(babelConfig);

module.exports = {
  runServer,
  runWebpackDevServer
}
