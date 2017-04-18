module.exports = function registerBabel(babelConfig) {
  // node.js (other than webpack) has no ES6 modules support, so use commonjs
  babelConfig.presets[0][1].modules = 'commonjs';

  // enable runtime transpilation to use ES6/7 in node
  // babel registration (runtime transpilation for node)
  require('babel-register')(babelConfig);
};
