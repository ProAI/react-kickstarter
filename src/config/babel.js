module.exports = {
  babelrc: false,
  presets: [
    // webpack can resolve ES6 modules, so disable commonjs modules
    [require.resolve('babel-preset-env'), { modules: false }],
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-2'),
  ],
  plugins: [
    // TODO - Verify that we don't need babel-plugin-transform-runtime anymore
    // require.resolve("babel-plugin-transform-runtime")
  ],
};
