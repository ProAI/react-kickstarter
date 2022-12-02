module.exports = {
  host: 'localhost',
  port: 8080,
  proxies: [],
  ssr: true,
  device: {
    detection: true,
    cookieName: 'view',
  },
  intl: {
    localeDetection: true,
    defaultLocale: 'en',
    locales: ['en'],
    localeCookieName: 'lang',
  },
};
