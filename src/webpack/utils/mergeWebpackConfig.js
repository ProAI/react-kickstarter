module.exports = function mergeWebpackConfig(defaultWebpackConfig, customConfig, development) {
  const webpackConfig = defaultWebpackConfig;

  // modify host and port
  if (development) {
    const host = customConfig.devServer.host;
    const port = customConfig.devServer.port;
    webpackConfig.entry.main[0] = require.resolve('webpack-hot-middleware/client')
      + '?path=http://' + host + ':' + port + '/__webpack_hmr';
    webpackConfig.output.publicPath = 'http://' + host + ':' + port + '/dist/';
  }

  // add custom entries
  if (customConfig.customEntries.main) {
    webpackConfig.entry.main = webpackConfig.entry.main.concat(customConfig.customEntries.main);
  }
  if (customConfig.customEntries.desktop) {
    webpackConfig.entry.desktop = customConfig.customEntries.desktop;
  }
  if (customConfig.customEntries.mobile) {
    webpackConfig.entry.mobile = customConfig.customEntries.mobile;
  }

  // add include paths for dev modules
  if (customConfig.devModules.include) {
    webpackConfig.module.rules.forEach((value, key) => {
      if (value.include) {
        webpackConfig.module.rules[key].include = value.include.concat(customConfig.devModules.include);
      }
    });
  }

  // add aliases for dev modules
  if (customConfig.devModules.alias) {
    webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias, customConfig.devModules.alias);
  }

  return webpackConfig;
};
