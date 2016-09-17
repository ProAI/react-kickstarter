import React from 'react';
import ReactDOM from 'react-dom/server';

import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import { Provider } from 'react-redux';
import { useBasename } from 'history';

import createStore from './start/store/createStore';
import Api from './utils/Api';

import getRoutes from './routes'; // routes from config???

const stripLocaleFromUrl = (url, locale) => {
  if (locale) {
    if (url.length === 2) {
      return '';
    }
    return url.substring(3, url.length);
  }
  return url;
};

export default function bootstrapAppOnServer(config) {
  return (req, res) => {
    function addCookie(name, value, options) {
      // eslint-disable-next-line no-param-reassign
      req.cookies[name] = value;
      if (req.headers.cookie === undefined) {
        // eslint-disable-next-line no-param-reassign
        req.headers.cookie = `${name}=${value}`;
      } else {
        // eslint-disable-next-line no-param-reassign
        req.headers.cookie = `${req.headers.cookie};${name}=${value}`;
      }
      res.cookie(name, value, options);
    }

    // meta data
    const meta = {};

    // auto detect locale
    if (config.locale.autoDetect) {
      // init locale
      /* Locale.init(req);
      const locale = Locale.get();
      const localeFromUrl = Locale.getUrlLocale();
      const originalUrlWithoutLocale = (localeFromUrl)
        ? stripLocaleFromUrl(req.originalUrl, localeFromUrl)
        : req.originalUrl;*/

      { locale, localeFromUrl, localeFromCookie } = detectLocale(req, res, config.app.locale);

      /* if (!localeFromCookie) {
        addCookie('lang', locale, { maxAge: 2628000 * 60 * 1000 }); // 5 years lifetime
      }*/
    }

    // generate csrf token
    if (config.csrfToken) {
      meta.csrfToken = generateCsrfToken(req, res);

      /* let csrfToken;
      if (req.cookies.csrf === undefined) {
        csrfToken = randomString.generate(32);
        addCookie('csrf', csrfToken, { httpOnly: true });
      } else {
        csrfToken = req.cookies.csrf;
      }*/
    }

    // auto detect device
    if (config.device.autoDetect) {
      meta.device = detectDevice(req, res);

      /* let view;
      if (req.cookies.view === 'mobile' || req.cookies.view === 'desktop') {
        view = req.cookies.view;
      } else {
        const md = new MobileDetect(req.headers['user-agent']);
        if (md.mobile() !== null) {
          if (md.phone() !== null) {
            // phone
            view = 'mobile';
          } else {
            // tablet
            view = 'desktop';
          }
        } else {
          // desktop
          view = 'desktop';
        }
      }*/
    }

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();

      // delete cached dev modules
      delete require.cache[require.resolve('react-essentials')];
      // delete require.cache[require.resolve('react-kickstarter')];
    }

    Api.init(req, res);
    const basename = localeFromUrl ? `/${localeFromUrl}` : '';
    const memoryHistory = useBasename(() => createMemoryHistory(cleanUrl))({
      basename,
    });
    const store = createStore(memoryHistory, Api, {
      info: {
        locale: meta.locale,
        device: meta.device,
      }
    });
    const history = syncHistoryWithStore(memoryHistory, store);

    function hydrateOnClient() {
      res.send(`<!doctype html>
        ${ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            meta={meta}
            url={cleanUrl}
            store={store}
          />
        )}
      `);
    }

    if (__DISABLE_SSR__) {
      hydrateOnClient();
      return;
    }

    match({
      history,
      routes: getRoutes(store, basename),
      location: originalUrlWithoutLocale,
    }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', error);
        res.status(500);
        hydrateOnClient();
      } else if (renderProps) {
        loadOnServer({ ...renderProps, store, helpers: { Api } }).then(() => {
          const component = (
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );

          res.status(200);

          global.navigator = { userAgent: req.headers['user-agent'] };

          res.send(`<!doctype html>
            ${ReactDOM.renderToString(
              <Html
                assets={webpackIsomorphicTools.assets()}
                meta={meta}
                url={originalUrlWithoutLocale}
                component={component}
                store={store}
              />
            )}
          `);
        }).catch(mountError => {
          console.error('MOUNT ERROR:', mountError);
          res.status(500);
        });
      } else {
        res.status(404).send('Not found');
      }
    });
  };
};