const path = require('path');
const findCacheDir = require('find-cache-dir');
const fs = require('fs');

const appRootPath = process.cwd();

const realAppRootPath = fs.realpathSync(appRootPath);

function resolveAppPath(relativePath) {
  return path.resolve(realAppRootPath, relativePath);
}

function resolveKickstarterPath(relativePath) {
  return path.join(__dirname, '../..', relativePath);
}

const webpackCachePath = findCacheDir({ name: 'webpack' });

function resolveWebpackCachePath(relativePath) {
  return path.resolve(webpackCachePath, relativePath);
}

module.exports = {
  appRoot: resolveAppPath('.'),
  appMain: resolveAppPath('app'),
  appResources: resolveAppPath('resources'),
  appClientEntry: resolveAppPath('app/client.js'),
  appServerEntry: resolveAppPath('app/server.js'),
  appHtml: resolveAppPath('app/html.js'),
  appNodeModules: resolveAppPath('node_modules'),
  appPublic: resolveAppPath('public'),
  appAssets: resolveAppPath('public/dist'),
  kickstarterRoot: resolveKickstarterPath('.'), // not in use yet
  kickstarterConfig: resolveKickstarterPath('src/config'),
  kickstarterClientEntry: resolveKickstarterPath('src/bootstrap/client/start.js'),
  kickstarterNodeModules: resolveKickstarterPath('node_modules'),
  webpackManifest: resolveAppPath('webpack-manifest.json'),
  webpackDllVendor: resolveWebpackCachePath('dll/vendor.json'),
  webpackCacheProd: resolveWebpackCachePath('prod'),
};
