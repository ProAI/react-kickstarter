const fs = require('fs');
const path = require('path');
const paths = require('../../config/paths');

module.exports = function validateDll() {
  const dllName = 'vendor';

  try {
    const manifest = require(path.join(paths.webpackCache, 'dll', `${dllName}.json`));
    const dll = fs.readFileSync(path.join(paths.appPublic, 'dll', `dll__${dllName}.js`)).toString('utf-8');
    if (dll.indexOf(manifest.name) === -1) {
      console.warn(`Webpack: Invalid DLL ${dllName}`);
      return false;
    }
  } catch (e) {
    console.warn(e.message);
    return false;
  }

  return true;
}
