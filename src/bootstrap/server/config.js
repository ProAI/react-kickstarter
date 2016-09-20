var path = require('path');
var paths = require('./paths');

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
  favicon: path.join(paths.static, 'favicon', 'favicon.ico')
};
