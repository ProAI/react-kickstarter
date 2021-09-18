const webpack = require('webpack');
const deepmerge = require('deepmerge');
const defaultConfig = require('./defaultConfig');
const getDllDependencyNames = require('../utils/getDllDependencyNames');
const defaultWebpackConfig = require('../../config/webpack-dll');

module.exports = function buildDllWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // modify webpack config
  const webpackConfig = defaultWebpackConfig;
  webpackConfig.entry.vendor = getDllDependencyNames(config);

  // webpack compiler
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    // console log stats
    // eslint-disable-next-line no-console
    console.log(
      stats.toString({
        colors: true,
      }),
    );

    compiler.close((closeErr) => {
      // eslint-disable-next-line no-console
      if (closeErr) console.error(closeErr);
    });
  });
};
