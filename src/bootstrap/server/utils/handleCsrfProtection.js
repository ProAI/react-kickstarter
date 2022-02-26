const randomString = require('randomstring');

const TOKEN_LENGTH = 32;

module.exports = function handleCsrfProtection(req, res, config) {
  const { protection, cookieName, headerName } = config;

  if (!protection) {
    return {
      headers: {},
    };
  }

  const cookie = req.cookies[cookieName];

  if (cookie && cookie.length === TOKEN_LENGTH) {
    return {
      headers: {
        [headerName]: cookie,
      },
    };
  }

  const token = randomString.generate(TOKEN_LENGTH);

  res.cookie(cookieName, token, { httpOnly: true });

  return {
    headers: {
      [headerName]: token,
    },
  };
};
