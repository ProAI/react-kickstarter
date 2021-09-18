const path = require('path');
const webpack = require('webpack');
const paths = require('../../config/paths');

function loadDllManifest(filePath) {
  try {
    // eslint-disable-next-line
    return require(filePath);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return undefined;
}

module.exports = function installDll(config) {
  const manifest = loadDllManifest(path.join(paths.webpackCache, 'dll', 'vendor.json'));

  if (!manifest) {
    return;
  }

  config.plugins.push(
    new webpack.DllReferencePlugin({
      context: paths.appRoot,
      manifest,
    }),
  );
};
