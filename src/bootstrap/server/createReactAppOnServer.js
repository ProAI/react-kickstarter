import React from 'react';
import ReactDOM from 'react-dom/server';
import addCookie from '../utils/addCookie';
import detectDevice from '../utils/detectDevice';
import getLocaleFromUrl from '../utils/getLocaleFromUrl';
import getLocaleFromHeader from '../utils/getLocaleFromHeader';
import getLocaleFromCookies from '../utils/getLocaleFromCookies';
import stripLocaleFromUrl from '../utils/stripLocaleFromUrl';
import generateCsrfToken from '../utils/generateCsrfToken';
import paths from '../../config/paths';
import serialize from 'serialize-javascript';
import 'isomorphic-fetch';

export default function createAppOnServer(config) {
  return (req, res) => {
    // auto detect locale
    let locale, localeFromUrl, localeFromHeader, localeFromCookies, urlWithoutLocale;
    if (true || config.locale.autoDetect) {
      localeFromUrl = getLocaleFromUrl(req.originalUrl, config.locale.supported);
      localeFromHeader = getLocaleFromHeader(req.headers['accept-language'], config.locale.supported);
      localeFromCookies = getLocaleFromCookies(req.cookies, config.locale.supported);

      if (localeFromUrl) {
        locale = localeFromUrl;
      } else if (localeFromHeader) {
        locale = localeFromHeader;
      } else if (localeFromCookies) {
        locale = localeFromCookies;
      } else {
        locale = config.locale.default;
      }

      urlWithoutLocale = (localeFromUrl)
        ? stripLocaleFromUrl(req.originalUrl, localeFromUrl)
        : req.originalUrl;

      if (!localeFromCookies) {
        addCookie(req, res, {
          name: 'lang',
          value: locale,
          options: { maxAge: 2628000 * 60 * 1000 } // 5 years lifetime
        });
      }
    }

    // auto detect device
    let device;
    if (config.device.autoDetect) {
      if (req.cookies.view === 'mobile' || req.cookies.view === 'desktop') {
        device = req.cookies.view;
      } else {
        device = detectDevice(req.headers['user-agent']);
      }
    }

    // generate csrf token
    let csrfToken;
    if (config.csrfToken) {
      if (req.cookies.csrf === undefined) {
        csrfToken = generateCsrfToken();
        addCookie(req, res, {
          name: 'csrf',
          value: csrfToken,
          options: { httpOnly: true }
        });
      } else {
        csrfToken = req.cookies.csrf;
      }
    }

    // basename
    const basename = localeFromUrl ? `/${localeFromUrl}` : '';

    // create meta data object
    const meta = {
      locale,
      localeFromUrl,
      localeFromHeader,
      localeFromCookies,
      urlWithoutLocale,
      csrfToken,
      basename,
    };

    // development
    if (config.env === 'development') {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();

      // delete cached dev modules
      delete require.cache[require.resolve('react-essentials')];
      // delete require.cache[require.resolve('react-kickstarter')];
    }

    /* CUSTOM CODE START */
    const render = (component, initialState) => {
      const renderHtml = require(paths.htmlFile);

      const html = renderHtml(
        component ? ReactDOM.renderToString(component) : '',
        webpackIsomorphicTools.assets(),
        initialState ? serialize(initialState) : '{}',
        meta,
      );

      res.status(200).send(html);
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

    if (__DISABLE_SSR__) {
      render();
      return;
    }

    const hydrate = require(paths.serverEntry);

    hydrate(meta, {
      error,
      redirect,
      render,
    });
    /* CUSTOM CODE END */
  };
};