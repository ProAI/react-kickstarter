module.exports = {
  host: 'localhost',
  port: 8080,
  proxies: [],
  ssr: true,
  network: {
    csrfProtection: true,
    csrfHeaderName: 'X-Csrf-Token',
    csrfCookieName: 'csrf',
  },
  media: {
    deviceDetection: true,
    deviceCookieName: 'view',
  },
  intl: {
    localeDetection: true,
    defaultLocale: 'en',
    locales: ['en'],
    localeCookieName: 'lang',
  },
  devBuild: {
    dll: false,
  },
};
