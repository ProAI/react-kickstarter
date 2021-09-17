const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  context: paths.appRoot,
  entry: {
    vendor: null, // will be defined in dll config
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
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    fallback: {
      fs: false,
      net: false,
      tls: false,
      path: false,
      stream: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
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
