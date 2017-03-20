var path = require('path');
var findCacheDir = require('find-cache-dir');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  root: resolveApp(''),
  app: resolveApp('app'),
  node: resolveApp('node_modules'),
  static: resolveApp('static'),
  assets: resolveApp('static/dist'),
  config: resolveApp('config'),
  webpackCache: findCacheDir({ name: 'webpack' })
}
