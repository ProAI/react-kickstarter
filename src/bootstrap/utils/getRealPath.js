module.exports = function getRealPath(req, locale, localeSource) {
  if (localeSource !== 'url') {
    const basename = '';

    return [basename, req.url];
  }

  const basename = `/${locale}`;
  const path = req.url.substring(locale.length + 1, req.url.length);

  return [basename, path];
};
