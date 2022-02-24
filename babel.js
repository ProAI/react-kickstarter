const config = require('./src/config/babel');

module.exports = (api) => {
  api.cache(true);

  return config;
};
