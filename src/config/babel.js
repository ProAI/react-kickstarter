const paths = require('./paths');

module.exports = {
  babelrc: false,
  presets: [
    [require.resolve('@babel/preset-env'), { modules: false }],
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
  ],
};
