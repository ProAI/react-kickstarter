// Webpack config for creating the production bundle.
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const paths = require('./paths');
const babelConfig = require('./babel.js');
const eslintConfig = require('./eslint.js');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const includePaths = [
  paths.app,
  path.join(paths.root, '..', 'react-essentials', 'src'),
  path.join(paths.root, '..', 'react-kickstarter/src/bootstrap')
];

module.exports = {
  devtool: 'source-map',
  context: paths.root,
  entry: {
    'main': [
      require.resolve('babel-polyfill'),
      path.join(__dirname, '/../bootstrap/client/execute.js'),
    ],
  },
  output: {
    path: paths.assets,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            // Point ESLint to our predefined config.
            options: {
              baseConfig: eslintConfig,
            }
          },
        ],
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: [
          {
            loader: 'babel-loader',
            // This causes a deprecation warning that is fixed in v7.0.0-alpha.2
            // https://github.com/babel/babel-loader/pull/391
            options: babelConfig
          }
        ]
      },
      // Define rules for sass files
      {
        test: /\.scss$/,
        include: includePaths,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                // sourceMap: true
              }
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
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              // options: { sourceMap: true }
            }
          ]
        })
      },
      // Process font files
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/font-woff' }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/octet-stream' }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'image/svg+xml' }
      },
      // Process images
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: { limit: 10000 }
      }
    ]
  },
  // Resolve node modules from node_modules app and react-kickstarter directory
  resolveLoader: {
    modules: [
      path.join(__dirname, '/../../node_modules'),
      paths.node,
    ],
  },
  resolve: {
    modules: [
      paths.app,
      paths.node
    ],
    alias: {
      'react-essentials/lib': path.join(paths.root, '..', 'react-essentials', 'src'),
      'react-essentials': path.join(paths.root, '..', 'react-essentials', 'src', 'index.js'),
    },
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    // clean old dist files
    new CleanPlugin([paths.assets], { root: paths.root }),

    // only load required languages for moment.js
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr/),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash].css',
      allChunks: true,
    }),

    // define process.env constants
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      APP_MODE: 'production',
      APP_ENV: 'client',
      APP_PLATFORM: 'web',
    }),

    // ignore dev config
    // new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      // sourceMap: true,
    }),

    // isomorphic
    webpackIsomorphicToolsPlugin
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
};
