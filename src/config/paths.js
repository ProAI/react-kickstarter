const path = require('path');
const findCacheDir = require('find-cache-dir');
const fs = require('fs');

// If NODE_PATH constant is set, then determine the base path from this
// constant. If NODE_PATH is not present, then get the base path from
// process.cwd(), but this only works when the process is started in the root
// directory.
const appRootPath = process.env.NODE_PATH ? path.join(process.env.NODE_PATH, '..') : process.cwd();

const realAppRootPath = fs.realpathSync(appRootPath);

function resolveAppPath(relativePath) {
  return path.resolve(realAppRootPath, relativePath);
}

function resolveKickstarterPath(relativePath) {
  return path.join(__dirname, '../..', relativePath);
}

module.exports = {
  appRoot: resolveAppPath('.'),
  appMain: resolveAppPath('app'),
  appClientEntry: resolveAppPath('app/client.js'),
  appServerEntry: resolveAppPath('app/server.js'),
  appHtml: resolveAppPath('app/html.js'),
  appNodeModules: resolveAppPath('node_modules'),
  appPublic: resolveAppPath('public'),
  appAssets: resolveAppPath('public/dist'),
  appFavicon: resolveAppPath('public/favicon/favicon.ico'),
  kickstarterRoot: resolveKickstarterPath('.'), // not in use yet
  kickstarterConfig: resolveKickstarterPath('src/config'),
  kickstarterClientEntry: resolveKickstarterPath('src/bootstrap/client/start.js'),
  kickstarterNodeModules: resolveKickstarterPath('node_modules'),
  webpackAssets: resolveAppPath('webpack-assets.json'),
  webpackCache: findCacheDir({ name: 'webpack' }), // for webpack dll
};
