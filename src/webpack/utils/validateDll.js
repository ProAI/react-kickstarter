const fs = require('fs');
const path = require('path');
const paths = require('../../config/paths');

module.exports = function validateDll() {
  const dllName = 'vendor';

  try {
    // eslint-disable-next-line
    const manifest = require(path.join(paths.webpackCache, 'dll', `${dllName}.json`));
    const dll = fs
      .readFileSync(path.join(paths.appPublic, 'dll', `dll__${dllName}.js`))
      .toString('utf-8');

    if (dll.indexOf(manifest.name) === -1) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};
