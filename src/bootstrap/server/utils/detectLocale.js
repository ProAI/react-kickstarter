const parseUrl = (url, locales) =>
  locales.find(
    (locale) => url === `/${locale}` || url.substring(0, locale.length + 2) === `/${locale}/`,
  );

const parseCookie = (cookie, locales) => {
  const index = locales.indexOf(cookie);

  return index === -1 ? null : locales[index];
};

module.exports = function detectLocale(req, config) {
  if (!config.localeDetection) {
    return [config.defaultLocale, null];
  }

  const localeFromUrl = parseUrl(req.originalUrl, config.locales);

  if (localeFromUrl) {
    return [localeFromUrl, 'url'];
  }

  const localeFromCookie = parseCookie(req.cookies[config.localeCookieName], config.locales);

  if (localeFromCookie) {
    return [localeFromCookie, 'cookie'];
  }

  const localeFromHeader = req.acceptsLanguages(...config.locales);

  if (localeFromHeader) {
    return [localeFromHeader, 'header'];
  }

  return [config.defaultLocale, null];
};
