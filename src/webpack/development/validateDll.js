const fs = require('fs');
const path = require('path');
const paths = require('../../config/paths');

module.exports = function validateDll() {
  try {
    // eslint-disable-next-line
    const manifest = require(paths.webpackDllVendor);
    const dll = fs
      .readFileSync(path.join(paths.appPublic, 'dll', 'dll__vendor.js'))
      .toString('utf-8');

    if (dll.indexOf(manifest.name) === -1) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};
