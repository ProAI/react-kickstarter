module.exports = {
  host: 'localhost',
  port: 8080,
  proxies: [],
  ssr: true,
  csrf: {
    protection: true,
    headerName: 'X-Csrf-Token',
    cookieName: 'csrf',
  },
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
