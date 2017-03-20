import ReactDOM from 'react-dom/server';
import addCookie from '../utils/addCookie';
import detectDevice from '../utils/detectDevice';
import getLocaleFromUrl from '../utils/getLocaleFromUrl';
import getLocaleFromHeader from '../utils/getLocaleFromHeader';
import getLocaleFromCookies from '../utils/getLocaleFromCookies';
import stripLocaleFromUrl from '../utils/stripLocaleFromUrl';
import generateCsrfToken from '../utils/generateCsrfToken';
import 'isomorphic-fetch';

export default function createAppOnServer(config) {
  return (req, res) => {
    // meta data
    const meta = {};

    // auto detect locale
    if (config.app.locale.autoDetect) {
      meta.localeFromUrl = getLocaleFromUrl(req.originalUrl, config.app.locale.available);
      meta.localeFromHeader = getLocaleFromHeader(req.headers['accept-language'], config.app.locale.available);
      meta.localeFromCookies = getLocaleFromCookies(req.cookies, config.app.locale.available);

      if (meta.localeFromUrl) {
        meta.locale = meta.localeFromUrl;
      } else if (meta.localeFromHeader) {
        meta.locale = meta.localeFromHeader;
      } else if (meta.localeFromCookies) {
        meta.locale = meta.localeFromCookies;
      } else {
        meta.locale = config.app.locale.default;
      }

      meta.urlWithoutLocale = (meta.localeFromUrl)
        ? stripLocaleFromUrl(req.originalUrl, meta.localeFromUrl)
        : req.originalUrl;

      if (!meta.localeFromCookies) {
        addCookie(req, res, {
          name: 'lang',
          value: locale,
          options: { maxAge: 2628000 * 60 * 1000 } // 5 years lifetime
        });
      }
    }

    // auto detect device
    if (config.app.device.autoDetect) {
      if (req.cookies.view === 'mobile' || req.cookies.view === 'desktop') {
        meta.device = req.cookies.view;
      } else {
        meta.device = detectDevice(req.headers['user-agent']);
      }
    }

    // generate csrf token
    if (config.app.csrfToken) {
      if (req.cookies.csrf === undefined) {
        meta.csrfToken = generateCsrfToken();
        addCookie(req, res, {
          name: 'csrf',
          value: meta.csrfToken,
          options: { httpOnly: true }
        });
      } else {
        meta.csrfToken = req.cookies.csrf;
      }
    }

    if (config.env === 'development') {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();

      // delete cached dev modules
      delete require.cache[require.resolve('react-essentials')];
      // delete require.cache[require.resolve('react-kickstarter')];
    }

    /* CUSTOM CODE START */
    const render = (component) => {
      res.status(200).send(`<!doctype html>
        ${ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            meta={meta}
            url={cleanUrl}
            store={store}
            component={component}
          />
        )}
      `);
    };

    const redirect = (path) => {
      res.redirect(path);
    }

    const error = (message, status) => {
      res.status(404);
      if (message) {
        res.send(message)
      }
    }

    // todo: import hydrate function
    hydrate(meta, {
      error,
      redirect,
      render,
    });
    /* CUSTOM CODE END */
  };
};