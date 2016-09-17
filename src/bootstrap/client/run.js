require('babel-polyfill');
var deepmerge = require('deepmerge');
var bootstrapReactAppOnClient = require('./bootstrapReactAppOnClient');
var defaultConfig = require('./configClient');

module.exports = function runClient(customConfig) {
  // merge config
  var config = deepmerge(defaultConfig, customConfig);

  var bootstrap = bootstrapReactAppOnClient(config);

  bootstrap();
}
