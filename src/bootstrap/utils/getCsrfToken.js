const randomString = require('randomstring');

module.exports = function generateCsrfToken(cookie, enabled) {
  // csrf token feature is not enabled
  if (!enabled) {
    return null;
  }

  // csrf token has already been generated and is present in cookie
  if (cookie !== undefined) {
    return cookie;
  }

  return randomString.generate(32);
};
