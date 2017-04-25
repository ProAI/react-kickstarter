module.exports = function getLocaleFromCookies(cookies, availableLanguages) {
  const cookie = cookies.lang;
  // eslint-disable-next-line no-restricted-syntax
  for (const language of availableLanguages) {
    if (cookie === language) {
      return language;
    }
  }

  return null;
};
