const webpack = require('webpack');
const deepmerge = require('deepmerge');
const webpackConfig = require('../../config/webpack-dll');

const defaultConfig = {
  include: null,
  exclude: null,
};

module.exports = function buildDllWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  // webpack compiler
  const compiler = webpack(webpackConfig(config));

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    // console log stats
    // eslint-disable-next-line no-console
    console.log(
      stats.toString({
        colors: true,
      }),
    );

    compiler.close((closeErr) => {
      // eslint-disable-next-line no-console
      if (closeErr) console.error(closeErr);
    });
  });
};
