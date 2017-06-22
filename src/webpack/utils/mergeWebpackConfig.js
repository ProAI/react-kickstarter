module.exports = function mergeWebpackConfig(defaultWebpackConfig, customConfig, development) {
  const webpackConfig = defaultWebpackConfig;

  // modify host and port
  if (development) {
    const host = customConfig.devServer.host;
    const port = customConfig.devServer.port;
    const hotMiddlewareEntry = `${require.resolve(
      'webpack-hot-middleware/client'
    )}?path=http://${host}:${port}/__webpack_hmr`;
    webpackConfig.entry.main[0] = hotMiddlewareEntry;
    webpackConfig.output.publicPath = `http://${host}:${port}/dist/`;
  }

  // add custom entries
  if (customConfig.styles.main) {
    customConfig.styles.main.forEach(styleEntry => {
      if (styleEntry.split('.').pop() === 'scss' || styleEntry.split('.').pop() === 'js') {
        webpackConfig.entry.main.push(styleEntry);
      }
    });
  }
  if (customConfig.styles.desktop) {
    customConfig.styles.desktop.forEach(styleEntry => {
      if (styleEntry.split('.').pop() === 'scss' || styleEntry.split('.').pop() === 'js') {
        if (webpackConfig.entry.desktop) {
          webpackConfig.entry.desktop.push(styleEntry);
        } else {
          webpackConfig.entry.desktop = [styleEntry];
        }
      }
    });
  }
  if (customConfig.styles.mobile) {
    customConfig.styles.mobile.forEach(styleEntry => {
      if (styleEntry.split('.').pop() === 'scss' || styleEntry.split('.').pop() === 'js') {
        if (webpackConfig.entry.mobile) {
          webpackConfig.entry.mobile.push(styleEntry);
        } else {
          webpackConfig.entry.mobile = [styleEntry];
        }
      }
    });
  }

  // add dev modules include paths and aliases
  if (customConfig.devModules) {
    Object.keys(customConfig.devModules).forEach(devModuleKey => {
      const devModule = customConfig.devModules[devModuleKey];

      // add include paths for dev modules
      if (devModule && devModule.include) {
        webpackConfig.module.rules.forEach((value, key) => {
          if (value.include) {
            webpackConfig.module.rules[key].include = value.include.concat([devModule.include]);
          }
        });
      }

      // add aliases for dev modules
      if (devModule && devModule.alias) {
        webpackConfig.resolve.alias = Object.assign(
          {},
          webpackConfig.resolve.alias,
          devModule.alias
        );
      }
    });
  }

  return webpackConfig;
};
