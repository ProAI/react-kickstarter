const randomString = require('randomstring');

const TOKEN_LENGTH = 32;

module.exports = function handleCsrfProtection(cookies, config) {
  const { protection, cookieName, headerName } = config;

  if (!protection) {
    return {
      headers: {},
    };
  }

  const cookie = cookies.get(cookieName);

  if (cookie && cookie.length === TOKEN_LENGTH) {
    return {
      headers: {
        [headerName]: cookie,
      },
    };
  }

  const token = randomString.generate(TOKEN_LENGTH);

  cookies.set(cookieName, token, { httpOnly: true });

  return {
    headers: {
      [headerName]: token,
    },
  };
};
