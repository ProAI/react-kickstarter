const path = require('path');
const webpack = require('webpack');
const paths = require('../../config/paths');

function loadDllManifest(filePath) {
  try {
    // eslint-disable-next-line
    return require(filePath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      'Webpack: Dll manifest could not be found, try npm run build-dll to build manifest.'
    );
  }

  return undefined;
}

module.exports = function installDll(config) {
  const dllName = 'vendor';

  const manifest = loadDllManifest(path.join(paths.webpackCache, 'dll', `${dllName}.json`));

  if (manifest) {
    // eslint-disable-next-line no-console
    console.log(`Webpack: Dll ${dllName} will be used.`);

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: paths.appRoot,
        manifest,
      })
    );
  }
};
