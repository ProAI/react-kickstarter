module.exports = function stripLocaleFromUrl(url, locale) {
  if (locale) {
    if (url.length === 2) {
      return '';
    }
    return url.substring(3, url.length);
  }
  return url;
};
