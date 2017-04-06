module.exports = function getLocaleFromCookies(cookies, availableLanguages) {
  const cookie = cookies.lang;
  for (const language of availableLanguages) {
    if (cookie === language) {
      return language;
    }
  }

  return null;
}
