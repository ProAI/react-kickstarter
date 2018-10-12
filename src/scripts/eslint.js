#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const which = require('which');

const args = process.argv.slice(2);

// copied from https://github.com/kentcdodds/kcd-scripts/blob/master/src/utils.js
function resolveBin(modName, { executable = modName, cwd = process.cwd() } = {}) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const { bin } = require(modPkgPath);
    /* eslint-enable */
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

const result = spawn.sync(resolveBin('eslint'), args, { stdio: 'inherit' });

process.exit(result.status);
