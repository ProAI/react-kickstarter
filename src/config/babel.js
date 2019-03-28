module.exports = {
  babelrc: false,
  presets: [
    [require.resolve('@babel/preset-env'), { modules: false }],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-flow'),
  ],
  plugins: [
    require.resolve('react-hot-loader/babel'),
    require.resolve('babel-plugin-intlized-components'),
    require.resolve('@babel/plugin-transform-flow-strip-types'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
  ],
};
