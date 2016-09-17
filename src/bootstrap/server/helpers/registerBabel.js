module.exports = function registerBabel(babelConfig) {
  // enable runtime transpilation to use ES6/7 in node
  // babel registration (runtime transpilation for node)
  require('babel-register')(babelConfig);
};
