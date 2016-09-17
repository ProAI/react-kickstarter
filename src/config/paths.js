var path = require('path');
var findCacheDir = require('find-cache-dir');

module.exports = {
  root: path.resolve(__dirname, '../'),
  app: path.resolve(__dirname, '../app'),
  node: path.resolve(__dirname, '../node_modules'),
  static: path.resolve(__dirname, '../static'),
  assets: path.resolve(__dirname, '../static/dist'),
  config: path.resolve(__dirname, '../config'),
  webpackCache: findCacheDir({ name: 'webpack' })
}