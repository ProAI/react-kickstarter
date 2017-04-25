module.exports = function getLocaleFromUrl(url, availableLanguages) {
  // eslint-disable-next-line no-restricted-syntax
  for (const language of availableLanguages) {
    if (url === `/${language}` || url.substring(0, 4) === `/${language}/`) {
      return language;
    }
  }

  return null;
};
