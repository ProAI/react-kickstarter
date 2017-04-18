module.exports = {
  "babelrc": false,
  "presets": [
    [require.resolve('babel-preset-env'), { modules: false }],
    require.resolve("babel-preset-react"),
    require.resolve("babel-preset-stage-2")
  ],
  "plugins": [
    // TODO: Verify that we don't need transform runtime plugin
    // require.resolve("babel-plugin-transform-runtime")
  ]
};
