// Webpack config for development
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const paths = require('./paths');
const babelConfig = require('./babel');

const host = 'localhost';
const port = 8081;

const includePaths = [
  paths.appMain,
  paths.appResources,
  path.join(paths.appNodeModules, 'react-kickstarter/src'),
];

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  context: paths.appRoot,
  entry: {
    main: [
      `${require.resolve('webpack-hot-middleware/client')}?path=/__webpack_hmr`,
      paths.kickstarterClientEntry,
    ],
  },
  output: {
    path: paths.appAssets,
    pathinfo: false,
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
  },
  infrastructureLogging: {
    level: 'warn',
  },
  module: {
    unsafeCache: true,
    rules: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: [
          {
            loader: 'babel-loader',
            options: { ...babelConfig, cacheDirectory: true },
          },
        ],
      },
      // Define rules for sass files
      // Forked from https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
      {
        test: /\.scss$/,
        include: includePaths,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                  'postcss-normalize',
                ],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // Process font files
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
      },
    ],
  },
  // Resolve node modules from node_modules app and react-kickstarter directory
  resolveLoader: {
    modules: [paths.kickstarterNodeModules, paths.appNodeModules],
  },
  resolve: {
    modules: [paths.appMain, paths.appResources, paths.appNodeModules],
    alias: {
      appClientEntry: paths.appClientEntry,
      'react-native': 'react-native-web',
    },
    extensions: ['.json', '.ts', '.tsx', '.js', '.jsx'],
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
    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    // react fash refresh
    new ReactRefreshWebpackPlugin(),

    // ignore webpack stats
    new webpack.IgnorePlugin({ resourceRegExp: /webpack-stats\.json$/ }),

    // define process.env constants
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      APP_MODE: 'development',
      APP_ENV: 'client',
      APP_PLATFORM: 'web',
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
