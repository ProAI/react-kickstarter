const randomString = require('randomstring');

const TOKEN_LENGTH = 32;

module.exports = function handleCsrfProtection(cookies, config) {
  if (!config.csrfProtection) {
    return {};
  }

  const cookie = cookies.get(config.csrfCookieName);

  if (cookie && cookie.length === TOKEN_LENGTH) {
    return cookie;
  }

  const token = randomString.generate(TOKEN_LENGTH);

  cookies.set(config.csrfCookieName, token, { httpOnly: true });

  return {
    [config.csrfHeaderName]: token,
  };
};
