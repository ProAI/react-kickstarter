// Webpack config for creating the production bundle.
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  return {
    ...webpackBaseConfig(false, false),
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    entry: {
      main: paths.appServerEntry,
    },
    output: {
      path: path.join(paths.webpackCache, 'prod'),
      filename: 'server-bundle.js',
      library: {
        type: 'commonjs2',
      },
    },
    externalsPresets: { node: true },
    externals: {
      react: 'commonjs2 react',
      'react-dom': 'commonjs2 react-dom',
      // Workaround for https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1203
      canvas: 'canvas',
    },
    plugins: [
      // no need to clean old files here as the filename is always the same.

      // disable code splitting for server code
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: false,
      }),
    ],
  };
};
