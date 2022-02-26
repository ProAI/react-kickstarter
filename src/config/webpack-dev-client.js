// Webpack config for development
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = (config) => {
  const { host, port } = config.devServer;

  return {
    ...webpackBaseConfig(true, true),
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: [
      `${require.resolve(
        'webpack-hot-middleware/client',
      )}?path=http://${host}:${port}/__webpack_hmr`,
      paths.kickstarterClientEntry,
    ],
    output: {
      path: paths.appAssets,
      pathinfo: false,
      filename: 'client-bundle.js',
      chunkFilename: 'client-bundle.[id].js',
      publicPath: `http://${host}:${port}/dist/`,
    },
    plugins: [
      // no need to clean old files here as webpack dev server does not write to disk.

      // hot reload
      new webpack.HotModuleReplacementPlugin(),

      // react fash refresh
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),

      // ignore paths from watching
      new webpack.WatchIgnorePlugin(config.ignore),

      // polyfill node modules
      new NodePolyfillPlugin(),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: true,
      }),

      new WebpackManifestPlugin({
        fileName: paths.webpackManifest,
        writeToFileEmit: true,
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      hot: true,
      client: {
        logging: 'warn',
      },
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  };
};
