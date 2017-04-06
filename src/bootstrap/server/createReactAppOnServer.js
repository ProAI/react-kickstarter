import React from 'react';
import ReactDOM from 'react-dom/server';
import addCookie from '../utils/addCookie';
import detectDevice from '../utils/detectDevice';
import detectLocale from '../utils/detectLocale';
import getCsrfToken from '../utils/getCsrfToken';
import getLocaleFromCookies from '../utils/getLocaleFromCookies';
import getLocaleFromHeader from '../utils/getLocaleFromHeader';
import getLocaleFromUrl from '../utils/getLocaleFromUrl';
import stripLocaleFromUrl from '../utils/stripLocaleFromUrl';
import paths from '../../config/paths';
// import 'isomorphic-fetch';

export default function createAppOnServer(config, enableCookies, enableSSR) {
  return (req, res) => {
    // try to find locale from url, header and cookies
    const localeFromUrl = getLocaleFromUrl(req.originalUrl, config.locale.supported);
    const localeFromHeader = getLocaleFromHeader(req.headers['accept-language'], config.locale.supported);
    const localeFromCookies = getLocaleFromCookies(req.cookies, config.locale.supported);

    const urlWithoutLocale = (localeFromUrl)
      ? stripLocaleFromUrl(req.originalUrl, localeFromUrl)
      : req.originalUrl;

    // (auto) detect locale
    const locale = detectLocale(
      config.locale.default,
      localeFromUrl,
      localeFromHeader,
      localeFromCookies,
      config.locale.autoDetect
    );

    // if cookies are enabled, set language cookie
    if (enableCookies && !localeFromCookies) {
      addCookie(req, res, {
        name: 'lang',
        value: locale,
        options: { maxAge: 2628000 * 60 * 1000 } // 5 years lifetime
      });
    }

    // (auto) detect device
    const device = detectDevice(
      req.headers['user-agent'],
      req.cookies.view,
      config.device.autoDetect
    );

    // set csrf token
    const csrfToken = getCsrfToken(req.cookies.csrf, config.csrfToken);

    // if cookies and csrf token are enabled, set csrf token cookie
    if (enableCookies && config.csrfToken && req.cookies.csrf === undefined) {
      addCookie(req, res, {
        name: 'csrf',
        value: csrfToken,
        options: { httpOnly: true }
      });
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
      device,
      csrfToken,
      basename,
    };

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    if (process.env.APP_MODE === 'development') {
      webpackIsomorphicTools.refresh();
    }

    // define render, redirect and error function for hydrate function
    const render = (component, data) => {
      const renderHtml = require(paths.appHtml);

      const html = renderHtml(
        component ? ReactDOM.renderToString(component) : '',
        meta,
        webpackIsomorphicTools.assets(),
        data ? data : {},
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

    // Render page on client if server side rendering is disabled.
    // Initial state should be empty in this case.
    if (!enableSSR) {
      render();
      return;
    }

    // get hydrate function and hydrate
    const hydrate = require(paths.appServerEntry);
    hydrate(meta, { error, redirect, render });
  };
};