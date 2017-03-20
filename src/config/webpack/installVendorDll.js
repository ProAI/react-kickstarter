var path = require('path');
var webpack = require('webpack');
var paths = require('../paths');

function installVendorDll(config, dllName) {
  var manifest = loadDllManifest(path.join(paths.webpackCache, 'dlls', `${dllName}.json`));

  if (manifest) {
    console.log(`Webpack: Dll ${dllName} will be used.`);

    config.plugins.push(new webpack.DllReferencePlugin({
      context: paths.root,
      manifest: manifest
    }));
  }
};

function loadDllManifest(filePath) {
  try {
    return require(filePath);
  }
  catch (e) {
    process.env.WEBPACK_DllS = '0';

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack Dlls (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the Dlls.
You can do that by running:
    npm run build-dlls
The request to use Dlls for this build will be ignored.`);
  }

  return undefined;
}

module.exports = installVendorDll;
