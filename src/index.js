var runServer = require('./bootstrap/server/run');
var runWebpackDevServer = require('./bootstrap/webpackDevServer/run');
var makeBabelConfig = require('./config/babel');
var makeEslintConfig = require('./config/eslint');
var makeWebpackConfig = require('./config/webpack.dev');
var registerBabel = require('./bootstrap/helpers/registerBabel');
var babelConfig = require('./config/babel');
// import Html from './components/Html';
// import Head from './components/Head';
// import Body from './components/Body';

// babel registration (runtime transpilation for node)
registerBabel(babelConfig);

module.exports = {
  runServer,
  runWebpackDevServer,
  makeBabelConfig,
  makeEslintConfig,
  makeWebpackConfig,
  // Html,
  // Head,
  // Body,
}
