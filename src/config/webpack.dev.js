// Webpack config for development
const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const paths = require('./paths');
const babelConfig = require('./babel.js');
const eslintConfig = require('./eslint.js');

const host = 'localhost';
const port = 8081;
const clientEntry = path.join(__dirname, '/../bootstrap/client/execute.js');
const ownNodeModules = path.join(__dirname, '/../../node_modules');

process.traceDeprecation = true;

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const includePaths = [
  paths.app,
  path.join(paths.root, '..', 'react-essentials', 'src'),
  path.join(paths.root, '..', 'react-kickstarter', 'src')
];

const webpackConfig = {
  devtool: 'cheap-module-eval-source-map',
  context: paths.root,
  entry: {
    'main': [
      require.resolve('webpack-hot-middleware/client') + '?path=http://' + host + ':' + port + '/__webpack_hmr',
      require.resolve('react-hot-loader/patch'),
      require.resolve('babel-polyfill'),
      '-!style-loader!raw-loader!sass-loader!./app/theme/scss/examunity-bootstrap.dev.scss',
      '-!style-loader!css-loader!sass-loader!./app/theme/scss/examunity-fonts.scss',
      clientEntry,
    ]
  },
  output: {
    path: paths.assets,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
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
              // useEslintrc: false,
              baseConfig: eslintConfig,
            }
          },
        ],
      },
      // Process react-hot-loader and process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: includePaths,
        use: [
          {
            loader: 'react-hot-loader/webpack',
          },
          {
            loader: 'babel-loader',
            // This causes a deprecation warning that is fixed in v7.0.0-alpha.2
            // https://github.com/babel/babel-loader/pull/391
            options: Object.assign({}, babelConfig, { cacheDirectory: true })
          }
        ]
      },
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
              modules: true,
              importLoaders: 2,
              sourceMap: true,
              localIdentName: '[local]___[hash:base64:5]',
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
            options: {
              outputStyle: 'expanded',
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }
    ]
  },
  // Resolve loaders (webpack plugins for CSS, images, transpilation) from the
  // directory of `react-scripts` itself rather than the project directory.
  resolveLoader: {
    modules: [
      ownNodeModules,
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
      'react-kickstarter/lib': path.join(paths.root, '..', 'react-kickstarter', 'src'),
      'react-kickstarter': path.join(paths.root, '..', 'react-kickstarter', 'src', 'index.js'),
    },
    extensions: ['.json', '.js', '.jsx']
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
      __DEVTOOLS__: false // <-------- DISABLE redux-devtools HERE
    }),

    // isomorphic
    webpackIsomorphicToolsPlugin.development(),
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
  }
};

module.exports = webpackConfig;