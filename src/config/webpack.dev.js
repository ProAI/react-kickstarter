require('babel-polyfill');

// Webpack config for development
var path = require('path');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var createHappyPlugin = require('./utils/createHappyPlugin');
var installVendorDll = require('./utils/installVendorDll');
var isValidDlls = require('./utils/isValidDlls');
var paths = require('./paths');
var babelConfig = require('./babel.js');
var eslintConfig = {
  configFile: path.join(paths.config, 'eslint.js')
};

var host = 'localhost';
var port = 8081;

var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

// https://github.com/bertho-zero/react-redux-universal-hot-example
if (process.env.WEBPACK_DLLS === '1') {
  var validDlls = isValidDlls(['vendor'], paths.assets);
  if(!validDlls) {
    process.env.WEBPACK_DLLS = '0';
    console.warn('Webpack: Dlls are disabled.');
  }
}

var includePaths = [
  paths.app,
  path.join(paths.root, '..', 'react-essentials', 'src'),
  path.join(paths.root, '..', 'react-kickstarter', 'src')
];

var webpackConfig = {
  devtool: 'cheap-module-eval-source-map',
  context: paths.root,
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      'react-hot-loader/patch',
      '-!style!raw!sass!'+paths.app+'/theme/scss/examunity-bootstrap.dev.scss',
      '-!style!css!sass!'+paths.app+'/theme/scss/examunity-fonts.scss',
      paths.clientEntry,
    ]
  },
  output: {
    path: paths.assets,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      {
        happy: { id: 'jsx' },
        test: /\.jsx?$/,
        include: includePaths,
        loaders: [
          'react-hot-loader/webpack',
          'babel?' + JSON.stringify(babelConfig),
          'eslint?' + JSON.stringify(eslintConfig)
        ]
      },
      {
        happy: { id: 'json' },
        test: /\.json$/,
        include: includePaths,
        loader: 'json'
      },
      {
        happy: { id: 'sass' },
        test: /\.scss$/,
        include: includePaths,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
      },
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
    alias: {
      'react-essentials/lib': path.join(paths.root, '..', 'react-essentials', 'src'),
      'react-essentials': path.join(paths.root, '..', 'react-essentials', 'src', 'index.js'),
      'react-kickstarter/lib': path.join(paths.root, '..', 'react-kickstarter', 'src'),
      'react-kickstarter': path.join(paths.root, '..', 'react-kickstarter', 'src', 'index.js'),
    },
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    // only load required languages for moment.js
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr/),

    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    // ignore webpack stats
    new webpack.IgnorePlugin(/webpack-stats\.json$/),

    // constants
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },

      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false, // <-------- DISABLE redux-devtools HERE
      __DLLS__: process.env.WEBPACK_DLLS === '1'
    }),

    // isomorphic
    webpackIsomorphicToolsPlugin.development(),

    // happypack for faster init builds
    createHappyPlugin('jsx'),
    createHappyPlugin('json'),
    createHappyPlugin('sass')
  ]
};

if (process.env.WEBPACK_DLLS === '1' && validDlls) {
  installVendorDll(webpackConfig, 'vendor');
}

module.exports = webpackConfig;