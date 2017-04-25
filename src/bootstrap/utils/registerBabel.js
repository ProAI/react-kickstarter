const babelConfig = require('../../config/babel');

module.exports = function registerBabel() {
  // node.js (other than webpack) has no ES6 modules support, so use commonjs
  babelConfig.presets[0][1].modules = 'commonjs';

  // polyfill ES6/7 import() syntax in node
  babelConfig.plugins.push(require.resolve('babel-plugin-dynamic-import-node'));

  // enable runtime transpilation to use ES6/7 in node
  // babel registration (runtime transpilation for node)
  // eslint-disable-next-line global-require
  require('babel-register')(babelConfig);
};
