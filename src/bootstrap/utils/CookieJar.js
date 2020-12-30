const cookie = require('cookie');

class CookieJar {
  constructor(source, res) {
    this.cookies = cookie.parse(source.cookie || '');
    this.res = res;
  }

  get(name) {
    return this.cookies[name];
  }

  set(name, value, options) {
    this.cookies[name] = value;

    if (this.res) {
      this.res.cookie(name, value, options);
    } else {
      document.cookie = cookie.serialize(name, value, options);
    }
  }

  setFromResponse(headers) {
    if (!headers['set-cookie']) {
      return;
    }

    headers['set-cookie'].forEach(raw => {
      const [pair, ...rawOptions] = raw.split(';');

      const pairs = cookie.parse(pair);
      const keys = Object.keys(pairs);

      if (keys.length !== 1) {
        return;
      }

      const options = cookie.parse(rawOptions.join(';'));

      this.set(keys[0], pairs[keys[0]], {
        expires: options.Expires,
        maxAge: options['Max-Age'],
        domain: options.Domain,
        path: options.Path,
        secure: options.Secure,
        httpOnly: options.HttpOnly,
        sameSite: options.SameSite,
      });
    });
  }

  serialize() {
    return Object.keys(this.cookies)
      .map(key => `${key}=${this.cookies[key]}`)
      .join(';');
  }
}

module.exports = CookieJar;
