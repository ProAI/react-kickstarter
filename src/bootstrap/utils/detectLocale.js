const parseUrl = (url, locales) => {
  return locales.find(locale => {
    return url === `/${locale}` || url.substring(0, 4) === `/${locale}/`;
  });
};

const parseCookie = (cookie, locales) => {
  const index = locales.indexOf(cookie);

  return index === -1 ? null : locales[index];
};

module.exports = function detectLocale(req, cookies, config) {
  if (!config.localeDetection) {
    return [config.defaultLocale, null];
  }

  const localeFromUrl = parseUrl(req.originalUrl, config.locales);

  if (localeFromUrl) {
    return [localeFromUrl, 'url'];
  }

  const localeFromCookie = parseCookie(cookies.get(config.localeCookieName), config.locales);

  if (localeFromCookie) {
    return [localeFromCookie, 'cookie'];
  }

  const localeFromHeader = req.acceptsLanguages(...config.locales);

  if (localeFromHeader) {
    return [localeFromHeader, 'header'];
  }

  return [config.defaultLocale, null];
};
