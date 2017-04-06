module.exports = function addCookie(req, res, data) {
  // eslint-disable-next-line no-param-reassign
  req.cookies[data.name] = data.value;
  if (req.headers.cookie === undefined) {
    // eslint-disable-next-line no-param-reassign
    req.headers.cookie = `${data.name}=${data.value}`;
  } else {
    // eslint-disable-next-line no-param-reassign
    req.headers.cookie = `${req.headers.cookie};${data.name}=${data.value}`;
  }
  res.cookie(data.name, data.value, data.options);
}
