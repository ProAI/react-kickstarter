const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  context: paths.appRoot,
  entry: {
    vendor: undefined, // will be defined in dll config
  },
  output: {
    path: path.join(paths.appPublic, 'dll'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[fullhash]',
  },
  infrastructureLogging: {
    level: 'warn',
  },
  resolve: {
    modules: [paths.appNodeModules],
    extensions: ['.js'],
  },
  plugins: [
    // polyfill node modules
    new NodePolyfillPlugin(),

    // define process.env constants
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.DllPlugin({
      path: path.join(paths.webpackCache, 'dll', '[name].json'),
      name: 'DLL_[name]_[fullhash]',
    }),
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};
