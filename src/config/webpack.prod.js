// Webpack config for creating the production bundle.
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const paths = require('./paths');
const babelConfig = require('./babel');

const includePaths = [
  paths.appMain,
  paths.appResources,
  path.join(paths.appNodeModules, 'react-kickstarter/src'),
];

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: paths.appRoot,
  entry: {
    main: [paths.kickstarterClientEntry],
  },
  output: {
    path: paths.appAssets,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: [
          {
            loader: 'babel-loader',
            // This causes a deprecation warning that is fixed in v7.0.0-alpha.2
            // https://github.com/babel/babel-loader/pull/391
            options: babelConfig,
          },
        ],
      },
      // Define rules for sass files
      {
        test: /\.scss$/,
        include: includePaths,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // sourceMap: true
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
    // clean old dist files
    new CleanWebpackPlugin(),

    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),

    // minify css files
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        postcss: [autoprefixer],
      },
    }),

    // define process.env constants
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      APP_MODE: 'production',
      APP_ENV: 'client',
      APP_PLATFORM: 'web',
    }),

    new ManifestPlugin({
      fileName: paths.webpackManifest,
    }),

    // Minify the code.
    /* new UglifyJSPlugin({
      sourceMap: true,
    }), */
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
