const paths = require('./paths');

const isDev = process.env.APP_MODE === 'development';

module.exports = {
  babelrc: false,
  cacheDirectory: isDev,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-flow'),
  ],
  plugins: [
    [
      require.resolve('babel-plugin-intlized-components'),
      { customImportName: 'libs/intl', autoResolveKey: paths.appMain },
    ],
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
    ...(isDev ? [require.resolve('react-refresh/babel')] : []),
  ],
};
