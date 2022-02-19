const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const paths = require('./paths');
const babelConfig = require('./babel');

const includePaths = [
  paths.appMain,
  paths.appResources,
  path.join(paths.appNodeModules, 'react-kickstarter/src'),
];

// Parts of this config are forked from the great create-react-app package
// ref: https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
module.exports = (isDev) => {
  return {
    mode: undefined, // placeholder
    devtool: undefined, // placeholder
    context: paths.appRoot,
    entry: undefined, // placeholder
    output: undefined, // placeholder
    infrastructureLogging: {
      level: 'warn',
    },
    module: {
      unsafeCache: isDev,
      rules: [
        // Process JS/TS with Babel.
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: includePaths,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfig,
                plugins: [
                  ...babelConfig.plugins,
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: isDev,
              },
            },
          ],
        },
        // Process sass files
        {
          test: /\.scss$/,
          include: includePaths,
          use: [
            {
              loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                sourceMap: isDev,
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
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
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
      modules: [paths.appMain, paths.appResources, 'node_modules', paths.appNodeModules],
      alias: {
        appClientEntry: paths.appClientEntry,
        'react-native': 'react-native-web',
        // Add react and react-dom aliases, so that it's always the same instance
        react: path.join(paths.appNodeModules, 'react'),
        'react-dom': path.join(paths.appNodeModules, 'react-dom'),
      },
      extensions: [
        '.json',
        '.web.js',
        '.js',
        '.web.jsx',
        '.jsx',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
      ],
    },
    // Optimize production build
    optimization: {
      minimize: !isDev,
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
  };
};
