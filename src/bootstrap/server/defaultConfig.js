var path = require('path');
var paths = require('../../config/paths');

module.exports = {
  env: 'development',
  host: 'localhost',
  port: 8080,
  root: paths.root,
  static: paths.static,
  serverSideRendering: true,
  proxies: [],
  compression: true,
  cookies: true,
  favicon: path.join(paths.static, 'favicon', 'favicon.ico'),
  app: {
    /* routes: require('../redux/routes'),
    htmlComponent: require('../components/Html'),
    devToolsComponent: */
    csrfToken: true,
    locale: {
      autoDetect: true,
      default: 'en',
      supported: ['en'],
      urlPrefix: true,
    },
    device: {
      autoDetect: true
    },
    devTools: true,
    /* redux: {
      enable: true,
      useInfoReducer: true,
      store: require('../redux/configureStore'),
      fetch: require('../redux/fetch'),
    },*/
    /* build: {
      dlls: false,
      happypack: false
    }*/
  }
};
