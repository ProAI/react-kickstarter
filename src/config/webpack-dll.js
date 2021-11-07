const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const paths = require('./paths');

const getVendorEntries = (config) => {
  // eslint-disable-next-line
  const packageJson = require(path.join(paths.appRoot, 'package.json'));

  const dependencyNames = Object.keys(packageJson.dependencies);

  if (config.include) {
    return dependencyNames.filter((name) => config.include.includes(name));
  }

  if (config.exclude) {
    return dependencyNames.filter((name) => !config.exclude.includes(name));
  }

  return dependencyNames;
};

module.exports = (config) => {
  const vendorEntries = getVendorEntries(config);

  return {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    context: paths.appRoot,
    entry: {
      vendor: vendorEntries,
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
        path: paths.webpackDllVendor,
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
};
