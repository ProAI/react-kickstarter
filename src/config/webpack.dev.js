// Webpack config for development
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
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
  devtool: 'cheap-module-eval-source-map',
  context: paths.appRoot,
  entry: {
    main: [
      `${require.resolve('webpack-hot-middleware/client')}?path=/__webpack_hmr`,
      paths.kickstarterClientEntry,
    ],
  },
  output: {
    path: paths.appAssets,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // Process react-hot-loader and process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: [
          {
            loader: 'babel-loader',
            options: Object.assign({}, babelConfig, { cacheDirectory: true }),
          },
        ],
      },
      // Use react-hot-loader webpack plugin, because of "hot" patch for react-dom.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: ['react-hot-loader/webpack'],
      },
      // Define rules for sass files
      {
        test: /.*[^.raw]\.scss$/,
        include: includePaths,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // sourceMap: true,
              // localIdentName: '[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            // options: { sourceMap: true }
          },
        ],
      },
      // Define rules for .raw.scss sass files. These files will be loaded with
      // raw-loader in development in order to save some build time.
      {
        test: /.*[.raw]\.scss$/,
        include: includePaths,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'raw-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              // https://webpack.js.org/guides/migrating/#complex-options
              ident: 'postcss',
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            // options: { sourceMap: true }
          },
        ],
      },
      // Process font files
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/font-woff' },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/octet-stream' },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
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
    },
    extensions: ['.json', '.js', '.jsx'],
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    // ignore webpack stats
    new webpack.IgnorePlugin(/webpack-stats\.json$/),

    // define process.env constants
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      APP_MODE: 'development',
      APP_ENV: 'client',
      APP_PLATFORM: 'web',
    }),

    new ManifestPlugin({
      fileName: paths.webpackManifest,
      writeToFileEmit: true,
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};
