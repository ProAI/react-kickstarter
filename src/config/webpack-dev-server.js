// Webpack config for creating the production bundle.
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = (config) => {
  return {
    ...webpackBaseConfig(true, false),
    mode: 'development',
    target: 'node',
    devtool: 'eval-cheap-module-source-map',
    entry: {
      main: [
        `${require.resolve('webpack-hot-middleware/client')}?hot=true&live-reload=true`,
        paths.appServerEntry,
      ],
    },
    output: {
      path: path.join(paths.webpackCache, 'dev'),
      pathinfo: false,
      filename: 'server-bundle.js',
      chunkFilename: 'server-bundle.[id].js',
      library: {
        type: 'commonjs2',
      },
    },
    externalsPresets: { node: true },
    externals: {
      react: 'commonjs2 react',
      'react-dom': 'commonjs2 react-dom',
    },
    plugins: [
      // clean old dist files
      new CleanWebpackPlugin(),

      // hot reload
      new webpack.HotModuleReplacementPlugin(),

      // ignore paths from watching
      new webpack.WatchIgnorePlugin(config.ignore),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: true,
      }),
    ],
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  };
};
