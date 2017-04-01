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
  build: {
    dlls: false,
    happypack: false,
  }
};