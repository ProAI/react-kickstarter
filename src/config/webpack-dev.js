// Webpack config for development
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

const getEntries = (config, mainEntries) => {
  const entries = {
    main: [...mainEntries, ...config.styles.main],
  };

  if (config.styles.mobile) {
    entries.mobile = config.styles.mobile;
  }

  if (config.styles.desktop) {
    entries.desktop = config.styles.desktop;
  }

  return entries;
};

module.exports = (config) => {
  const { host, port } = config.devServer;

  const shouldUseDll = config.devBuild.dll && fs.existsSync(paths.webpackDllVendor);

  return {
    ...webpackBaseConfig(true),
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: getEntries(config, [
      `${require.resolve(
        'webpack-hot-middleware/client',
      )}?path=http://${host}:${port}/__webpack_hmr`,
      paths.kickstarterClientEntry,
    ]),
    output: {
      path: paths.appAssets,
      pathinfo: false,
      filename: 'client-bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: `http://${host}:${port}/dist/`,
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),

      // react fash refresh
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),

      // ignore webpack stats
      new webpack.IgnorePlugin({ resourceRegExp: /webpack-stats\.json$/ }),

      // polyfill node modules
      new NodePolyfillPlugin(),

      // define process.env constants
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        APP_MODE: 'development',
        APP_ENV: 'client',
        APP_PLATFORM: 'web',
      }),

      shouldUseDll &&
        new webpack.DllReferencePlugin({
          context: paths.appRoot,
          manifest: paths.webpackDllVendor,
        }),

      new WebpackManifestPlugin({
        fileName: paths.webpackManifest,
        writeToFileEmit: true,
      }),
    ].filter(Boolean),
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
