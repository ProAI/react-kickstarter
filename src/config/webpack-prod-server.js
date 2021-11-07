// Webpack config for creating the production bundle.
const webpack = require('webpack');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  return {
    ...webpackBaseConfig(false),
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    entry: {
      main: paths.appServerEntry,
    },
    output: {
      path: paths.webpackCacheProd,
      filename: 'server-bundle.js',
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
      // ignore style files
      new webpack.IgnorePlugin({ resourceRegExp: /\.(scss)$/ }),

      // disable code splitting for server code
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),

      // define process.env constants
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        APP_MODE: 'production',
        APP_ENV: 'server',
        APP_PLATFORM: 'web',
      }),
    ],
  };
};
