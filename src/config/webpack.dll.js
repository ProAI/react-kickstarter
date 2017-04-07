const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: paths.appRoot,
  entry: {
    vendor: null, // will be defined in /src/webpack/dll/build.js
  },
  output: {
    path: path.join(paths.appAssets, 'dll'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },
  resolve: {
    modules: [
      paths.appNodeModules,
    ],
    extensions: ['.js'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.DllPlugin({
      path: path.join(paths.webpackCache, 'dll', '[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  }
};
