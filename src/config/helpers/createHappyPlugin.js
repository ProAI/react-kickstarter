var path = require('path');
var HappyPack = require('happypack');
var paths = require('../config/paths');
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });

function createHappyPlugin(id) {
  return new HappyPack({
    id: id,
    threadPool: happyThreadPool,

    // happypack directory
    tempDir: path.join(paths.webpackCache, 'happypack'),

    // disable happypack with HAPPY=0
    enabled: process.env.HAPPY !== '0',

    // disable happypack caching with HAPPY_CACHE=0
    cache: process.env.HAPPY_CACHE !== '0',

    // make happypack more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1',
  });
}

module.exports = createHappyPlugin;
