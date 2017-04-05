const webpack = require("webpack");
const defaultConfig = require('./defaultConfig');
const deepmerge = require('deepmerge');
const mergeWebpackConfig = require('../utils/mergeWebpackConfig');
const defaultWebpackConfig = require("../../config/webpack.prod");

module.exports = function build(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // modify webpack config
  const webpackConfig = mergeWebpackConfig(defaultWebpackConfig, config);

  // webpack compiler
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true,    // Shows colors in the console
      children: false,
    }));
  });
};
