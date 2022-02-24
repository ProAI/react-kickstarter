const paths = require('./paths');

module.exports = {
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-flow'),
  ],
  plugins: [
    [
      require.resolve('babel-plugin-intlized-components'),
      { ignoreImport: true, autoResolveKey: paths.appMain },
    ],
    [require.resolve('babel-plugin-module-resolver'), { root: paths.appMain }],
  ],
};
