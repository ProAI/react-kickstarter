const path = require('path');
const findCacheDir = require('find-cache-dir');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  root: resolveApp(''),
  app: resolveApp('app'),
  clientEntry: resolveApp('app/client.js'),
  serverEntry: resolveApp('app/server.js'),
  htmlFile: resolveApp('app/html.js'),
  node: resolveApp('node_modules'),
  public: resolveApp('public'),
  assets: resolveApp('public/dist'),
  config: resolveApp('config'),
  webpackCache: findCacheDir({ name: 'webpack' })
}
