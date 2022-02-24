const config = require('./src/config/babel');

module.exports = (api) => {
  // Detect expo usage
  // const isExpo = !api.caller((caller) => caller && caller.name === 'babel-loader');

  api.cache(true);

  /* if (!isExpo) {
    return config;
  } */

  return {
    ...config,
    // Only use babel-preset-expo as preset for expo
    presets: ['babel-preset-expo'],
  };
};
