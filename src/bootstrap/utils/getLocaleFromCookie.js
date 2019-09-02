module.exports = function getLocaleFromCookie(cookie, availableLanguages) {
  const index = availableLanguages.indexOf(cookie);

  if (index !== -1) {
    return availableLanguages[index];
  }

  return null;
};
