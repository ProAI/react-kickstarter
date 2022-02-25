// Webpack config for creating the production bundle.
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

const getEntries = (config, mainEntries) => {
  const entries = {
    main: mainEntries,
  };

  if (config.styles.main) {
    entries.main = [...entries.main, ...config.styles.main];
  }

  if (config.styles.mobile) {
    entries.mobile = config.styles.mobile;
  }

  if (config.styles.desktop) {
    entries.desktop = config.styles.desktop;
  }

  return entries;
};

module.exports = (config) => {
  return {
    ...webpackBaseConfig(false, true),
    mode: 'production',
    devtool: 'source-map',
    entry: getEntries(config, [paths.kickstarterClientEntry]),
    output: {
      path: paths.appAssets,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/dist/',
    },
    plugins: [
      // clean old dist files
      new CleanWebpackPlugin(),

      // css files from the extract-text-plugin loader
      new MiniCssExtractPlugin({
        filename: '[name]-[chunkhash].css',
      }),

      // polyfill node modules
      new NodePolyfillPlugin(),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: false,
      }),

      new WebpackManifestPlugin({
        fileName: paths.webpackManifest,
      }),
    ],
  };
};
