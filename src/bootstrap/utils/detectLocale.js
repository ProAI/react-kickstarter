module.exports = function detectLocale(defaultLoc, urlLoc, headerLoc, cookiesLoc, auto) {
  if (auto && urlLoc) {
    return urlLoc;
  }

  if (auto && headerLoc) {
    return headerLoc;
  }

  if (auto && cookiesLoc) {
    return cookiesLoc;
  }

  return defaultLoc;
};
