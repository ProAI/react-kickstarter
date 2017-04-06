const path = require('path');
const findCacheDir = require('find-cache-dir');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

function resolveAppPath(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

function resolveKickstarterPath(relativePath) {
  return path.join(__dirname, '../..', relativePath);
}

module.exports = {
  appRoot: resolveAppPath('.'),
  appMain: resolveAppPath('app'),
  appClientEntry: resolveAppPath('app/client.js'), // not in use yet
  appServerEntry: resolveAppPath('app/server.js'),
  appHtml: resolveAppPath('app/html.js'),
  appNodeModules: resolveAppPath('node_modules'),
  appPublic: resolveAppPath('public'),
  appAssets: resolveAppPath('public/dist'),
  appFavicon: resolveAppPath('public/favicon/favicon.ico'),
  kickstarterRoot: resolveKickstarterPath('.'), // not in use yet
  kickstarterClientEntry: resolveKickstarterPath('src/bootstrap/client/start.js'),
  kickstarterNodeModules: resolveKickstarterPath('node_modules'),
  webpackCache: findCacheDir({ name: 'webpack' }) // for webpack dlls
}
