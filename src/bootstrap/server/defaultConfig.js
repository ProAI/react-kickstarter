const paths = require('../../config/paths');

module.exports = {
  host: 'localhost',
  port: 8080,
  root: paths.root,
  static: paths.static,
  proxies: [],
  enableSSR: true,
  enableCookies: true,
  favicon: null,
  app: {
    csrfToken: true,
    locale: {
      autoDetect: true,
      default: 'en',
      supported: ['en'],
    },
    device: {
      autoDetect: true
    },
  },
  /* build: {
    enableDLLs: false,
    happypack: false
  }*/
};
