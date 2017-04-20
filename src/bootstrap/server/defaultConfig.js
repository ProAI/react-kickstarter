const paths = require('../../config/paths');

module.exports = {
  host: 'localhost',
  port: 8080,
  proxies: [],
  ssr: true,
  cookies: true,
  app: {
    csrfToken: true,
    locale: {
      autoDetect: true,
      default: 'en',
      supported: ['en'],
    },
    device: {
      autoDetect: true
    },
  },
  devBuild: {
    dll: false,
  }
};
