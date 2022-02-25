const webpack = require('webpack');
const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');
const webpackConfigClient = require('../config/webpack-prod-client');
const webpackConfigServer = require('../config/webpack-prod-server');
const paths = require('../config/paths');

const defaultConfig = {
  only: null,
};

module.exports = function buildProductionWebpack(customConfig) {
  // merge config
  const config = deepmerge(defaultConfig, customConfig);

  const webpackConfigs = [];

  if (!config.only || config.only === 'SERVER') {
    webpackConfigs.push(webpackConfigServer());
  }

  if (!config.only || config.only === 'CLIENT') {
    webpackConfigs.push(webpackConfigClient(config));
  }

  // webpack compiler
  const compiler = webpack(webpackConfigs);

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    // save stats to file
    fs.writeFile(
      path.join(paths.appRoot, 'webpack-stats.json'),
      JSON.stringify(stats.toJson()),
      (fileErr) => {
        // eslint-disable-next-line no-console
        if (fileErr) console.log(fileErr);
      },
    );

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
