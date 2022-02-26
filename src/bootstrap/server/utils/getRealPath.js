module.exports = function getRealPath(url, locale, localeSource) {
  if (localeSource !== 'url') {
    const basename = '';

    return [basename, url];
  }

  const basename = `/${locale}`;
  const path = url.substring(locale.length + 1, url.length);

  return [basename, path];
};
