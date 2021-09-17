// Webpack config for creating the production bundle.
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
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
  infrastructureLogging: {
    level: 'warn',
  },
  module: {
    rules: [
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
      // Forked from https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
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
              importLoaders: 3,
              sourceMap: false,
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
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
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
  // Optimize production build
  // Forked from https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
      // This is only used in production mode
      new CssMinimizerPlugin(),
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
    extensions: ['.json', '.js', '.jsx'],
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
    // clean old dist files
    new CleanWebpackPlugin(),

    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),

    // define process.env constants
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      APP_MODE: 'production',
      APP_ENV: 'client',
      APP_PLATFORM: 'web',
    }),

    new WebpackManifestPlugin({
      fileName: paths.webpackManifest,
    }),
  ],
};
