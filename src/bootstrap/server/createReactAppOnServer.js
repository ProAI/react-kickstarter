const React = require('react');
const ReactDOM = require('react-dom/server');
// const 'isomorphic-fetch';
const addCookie = require('../utils/addCookie');
const detectDevice = require('../utils/detectDevice');
const detectLocale = require('../utils/detectLocale');
const generateHtmlSnippets = require('../utils/generateHtmlSnippets');
const getCsrfToken = require('../utils/getCsrfToken');
const getLocaleFromCookies = require('../utils/getLocaleFromCookies');
const getLocaleFromHeader = require('../utils/getLocaleFromHeader');
const getLocaleFromUrl = require('../utils/getLocaleFromUrl');
const stripLocaleFromUrl = require('../utils/stripLocaleFromUrl');
const paths = require('../../config/paths');

module.exports = function createAppOnServer(config) {
  return (req, res) => {
    // try to find locale from url, header and cookies
    const localeFromUrl = getLocaleFromUrl(req.originalUrl, config.app.locale.supported);
    const localeFromHeader = getLocaleFromHeader(req.headers['accept-language'], config.app.locale.supported);
    const localeFromCookies = getLocaleFromCookies(req.cookies, config.app.locale.supported);

    const url = req.url;
    const urlWithoutLocale = (localeFromUrl)
      ? stripLocaleFromUrl(req.originalUrl, localeFromUrl)
      : req.originalUrl;

    // (auto) detect locale
    const locale = detectLocale(
      config.app.locale.default,
      localeFromUrl,
      localeFromHeader,
      localeFromCookies,
      config.app.locale.autoDetect
    );

    // if cookies are enabled, set language cookie
    if (config.enableCookies && !localeFromCookies) {
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
      config.app.device.autoDetect
    );

    // set csrf token
    const csrfToken = getCsrfToken(req.cookies.csrf, config.app.csrfToken);

    // if cookies and csrf token are enabled, set csrf token cookie
    if (config.enableCookies && config.app.csrfToken && req.cookies.csrf === undefined) {
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
      url,
      urlWithoutLocale,
      device,
      csrfToken,
      basename,
    };

    // Do not cache webpack-stats.json and all files in /app folder in development
    // See https://github.com/ProAI/react-kickstarter/issues/4
    if (process.env.APP_MODE === 'development') {
      delete require.cache[paths.webpackAssets];

      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
      });
    }

    // define render, redirect and error function for hydrate function
    const render = (component, data) => {
      const assets = require(paths.webpackAssets);
      const content = component ? ReactDOM.renderToString(component) : '';
      const renderHtml = require(paths.appHtml).default;

      const htmlSnippets = generateHtmlSnippets(meta, content, assets, data, config.devBuild.dll);

      const html = renderHtml(meta, htmlSnippets);

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
    if (!config.enableSSR) {
      render();
      return;
    }

    // get hydrate function and hydrate
    const hydrate = require(paths.appServerEntry).default;
    hydrate(meta, { error, redirect, render });
  };
};