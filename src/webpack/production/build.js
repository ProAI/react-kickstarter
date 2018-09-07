const webpack = require('webpack');
const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');
const defaultConfig = require('./defaultConfig');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const defaultWebpackConfig = require('../../config/webpack.prod');
const paths = require('../../config/paths');

module.exports = function buildProductionWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // modify webpack config
  const webpackConfig = mergeWebpackConfig(defaultWebpackConfig, config);

  // webpack compiler
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    // save stats to file
    fs.writeFile(
      path.join(paths.appRoot, 'webpack-stats.json'),
      JSON.stringify(stats.toJson()),
      fileErr => {
        // eslint-disable-next-line no-console
        if (fileErr) console.log(fileErr);
      }
    );

    // console log stats
    // eslint-disable-next-line no-console
    console.log(stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true, // Shows colors in the console
      children: false,
    }));
  });
};
