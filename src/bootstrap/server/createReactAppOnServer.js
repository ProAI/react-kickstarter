import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import { Provider } from 'react-redux';
import { useBasename } from 'history';
import addCookie from '../helpers/addCookie';
import detectDevice from '../helpers/detectDevice';
import getLocaleFromUrl from '../helpers/getLocaleFromUrl';
import getLocaleFromHeader from '../helpers/getLocaleFromHeader';
import getLocaleFromCookies from '../helpers/getLocaleFromCookies';
import generateCsrfToken from '../helpers/generateCsrfToken';

export default function bootstrapAppOnServer(config) {
  return (req, res) => {
    // meta data
    const meta = {};

    // auto detect locale
    if (config.app.locale.autoDetect) {
      const localeFromUrl = getLocaleFromUrl(req.originalUrl, config.app.locale.available);
      const localeFromHeader = getLocaleFromHeader(req.headers['accept-language'], config.app.locale.available);
      const localeFromCookies = getLocaleFromCookies(req.cookies, config.app.locale.available);

      if (localeFromUrl) {
        meta.locale = localeFromUrl;
      } else if (localeFromHeader) {
        meta.locale = localeFromUrl;
      } else if (localeFromCookies) {
        meta.locale = localeFromUrl;
      } else {
        meta.locale = config.app.locale.default;
      }

      if (!localeFromCookies) {
        addCookie(req, res, {
          name: 'lang',
          value: locale,
          options: { maxAge: 2628000 * 60 * 1000 } // 5 years lifetime
        );
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
    (config, meta) => {
      const FetchClass = config.app.fetch;
      const fetch = new FetchClass(req, res);
      const cleanUrl = (localeFromUrl)
        ? stripLocaleFromUrl(req.originalUrl, localeFromUrl)
        : req.originalUrl;
      const basename = localeFromUrl ? `/${localeFromUrl}` : '';
      const memoryHistory = useBasename(() => createMemoryHistory(cleanUrl))({
        basename,
      });
      const data = {};
      if (config.app.useInfoReducer) {
        data.info = {
          locale: meta.locale,
          device: meta.device,
        };
      }
      const store = config.app.store(memoryHistory, fetch, data);
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

      if (!config.serverSideRendering) {
        hydrateOnClient();
        return;
      }

      match({
        history,
        routes: config.app.routes(store, basename),
        location: originalUrlWithoutLocale,
      }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', error);
          res.status(500);
          hydrateOnClient();
        } else if (renderProps) {
          loadOnServer({ ...renderProps, store, helpers: { fetch } }).then(() => {
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
    /* CUSTOM CODE END */
  };
};