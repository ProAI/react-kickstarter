module.exports = {
  host: 'localhost',
  port: 8081,
  server: {
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    // headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true}
  },
  isomorphic: require('../../config/webpack-isomorphic-tools'),
  webpack: require('../../config/webpack.dev'),
  build: {
    dlls: true,
    happypack: true,
  }
};