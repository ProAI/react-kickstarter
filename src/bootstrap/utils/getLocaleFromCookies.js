module.exports = function getLocaleFromCookies(cookies, availableLanguages) {
  const index = availableLanguages.indexOf(cookies.lang);

  if (index) {
    return availableLanguages[index];
  }

  return null;
};
