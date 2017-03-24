require('babel-polyfill');

// Webpack config for creating the production bundle.
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');
var paths = require('./paths');
var babelConfig = require('./babel.js');

var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  devtool: 'source-map',
  context: paths.root,
  entry: {
    'main': [
      paths.clientEntry,
      '-!' + ExtractTextPlugin.extract('style', 'css!sass!./app/theme/scss/examunity-fonts.scss')
    ],
    'mobile': [
      '-!' + ExtractTextPlugin.extract('style', 'css!sass!./app/theme/scss/examunity-bootstrap-mobile.prod.scss')
    ],
    'desktop': [
      '-!' + ExtractTextPlugin.extract('style', 'css!sass!./app/theme/scss/examunity-bootstrap-desktop.prod.scss')
    ]
  },
  output: {
    path: paths.assets,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel?' + JSON.stringify(babelConfig)] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!postcss?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      paths.app,
      paths.node
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    // clean old dist files
    new CleanPlugin([paths.assets], { root: paths.root }),

    // only load required languages for moment.js
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr/),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),

    // constants
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },

      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),

    // isomorphic
    webpackIsomorphicToolsPlugin
  ]
};
