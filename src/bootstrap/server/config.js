var path = require('path');
var paths = require('./paths');

module.exports = {
  env: 'development',
  host: 'localhost',
  port: 8080,
  root: paths.root,
  static: paths.static,
  isomorphic: {
    serverSideRendering: true,
    config: require('../config/webpack-isomorphic-tools');
  },
  proxies: [],
  compression: true,
  cookies: true,
  favicon: path.join(paths.static, 'favicon', 'favicon.ico'),
  app: {
    locale: {
      autoDetect: true,
      default: 'en',
      supported: ['en']
    },
    device: {
      autoDetect: true
    },
    csrfToken: true,
    localeUrlPrefix: true,
    rootComponent: require('../components/Html'),
    includeDlls: false
  }
  babel: require('../config/babel')
};
