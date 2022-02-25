// Webpack config for creating the production bundle.
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  return {
    ...webpackBaseConfig(false, true),
    mode: 'production',
    devtool: 'source-map',
    entry: [paths.kickstarterClientEntry],
    output: {
      path: paths.appAssets,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/dist/',
    },
    plugins: [
      // clean old dist files
      new CleanWebpackPlugin(),

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
