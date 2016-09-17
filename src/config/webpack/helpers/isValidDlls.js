var fs = require('fs');
var path = require('path');
var paths = require('../config/paths');

function isValidDlls(dllNames, assetsPath) {
  for (var dllName of dllNames) {
    try {
      var manifest = require(path.join(paths.webpackCache, 'dlls', `${dllName}.json`));
      var dll = fs.readFileSync(path.join(assetsPath, 'dlls', `dll__${dllName}.js`)).toString('utf-8');
      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`Webpack: Invalid DLL ${dllName}`);
        return false;
      }
    } catch (e) {
      console.warn(e.message);
      return false;
    }
  }
  return true;
}

module.exports = isValidDlls;
