const ReactDOMServer = require('react-dom/server');
const detectDevice = require('../utils/detectDevice');
const detectLocale = require('../utils/detectLocale');
const generateHtmlSnippets = require('../utils/generateHtmlSnippets');
const getCsrfToken = require('../utils/getCsrfToken');
const getLocaleFromCookie = require('../utils/getLocaleFromCookie');
const getLocaleFromHeader = require('../utils/getLocaleFromHeader');
const getLocaleFromUrl = require('../utils/getLocaleFromUrl');
const paths = require('../../config/paths');

module.exports = function createAppOnServer(config) {
  return (req, res) => {
    const { cookies } = req;

    // try to find locale from url, header and cookies
    const localeFromUrl = getLocaleFromUrl(req.originalUrl, config.app.locale.supported);
    const localeFromHeader = getLocaleFromHeader(
      req.headers['accept-language'],
      config.app.locale.supported,
    );
    const localeFromCookie = getLocaleFromCookie(req.cookies.lang, config.app.locale.supported);

    // (auto) detect locale
    const locale = detectLocale(
      config.app.locale.default,
      localeFromUrl,
      localeFromHeader,
      localeFromCookie,
      config.app.locale.autoDetect,
    );

    // if cookies are enabled, set language cookie
    if (config.cookies && !localeFromCookie) {
      // Add lang cookie to cookies object and to response
      cookies.lang = locale;
      res.cookie('lang', locale, { maxAge: 2628000 * 60 * 1000 }); // 5 years lifetime
    }

    // (auto) detect device
    const device = detectDevice(
      req.headers['user-agent'],
      req.cookies.view,
      config.app.device.autoDetect,
    );

    // set csrf token
    const csrfToken = getCsrfToken(req.cookies.csrf, config.app.csrfToken);

    // if cookies and csrf token are enabled, set csrf token cookie
    if (config.cookies && config.app.csrfToken && req.cookies.csrf === undefined) {
      // Add lang cookie to cookies object and to response
      cookies.csrf = csrfToken;
      res.cookie('csrf', csrfToken, { httpOnly: true });
    }

    // create meta data object
    const meta = {
      ssr: config.ssr,
      url: req.url,
      hostname: req.hostname,
      mockHostname: process.env.MOCK_HOST,
      csrfToken,
      device,
      locale: {
        supported: config.app.locale.supported,
        default: config.app.locale.default,
        current: locale,
        sources: {
          url: localeFromUrl,
          header: localeFromHeader,
          cookie: localeFromCookie,
        },
      },
    };

    const metaServerOnly = {
      req,
      cookies,
    };

    // Do not cache webpack-manifest.json and all files in /app folder in development
    // See https://github.com/ProAI/react-kickstarter/issues/4
    if (process.env.APP_MODE === 'development') {
      delete require.cache[paths.webpackManifest];

      Object.keys(require.cache).forEach(id => {
        if (/[/\\]app[/\\]/.test(id)) delete require.cache[id];
      });
    }

    // define render, redirect and error function for hydrate function
    const render = (component, getData, ...args) => {
      // eslint-disable-next-line
      const assets = require(paths.webpackManifest);
      const content = component ? ReactDOMServer.renderToString(component) : '';
      // eslint-disable-next-line
      const renderHtml = require(paths.appHtml).default;

      const htmlSnippets = generateHtmlSnippets(
        meta,
        content,
        assets,
        getData ? getData() : {},
        config.devBuild.dll,
      );

      const html = renderHtml(meta, htmlSnippets, ...args);

      res.status(200).send(html);
    };
    const redirect = path => {
      res.redirect(path);
    };
    const error = message => {
      res.status(404);
      if (message) {
        res.send(message);
      }
    };

    // Render page on client if server side rendering is disabled.
    // Initial state should be empty in this case.
    if (!config.ssr) {
      render();
      return;
    }

    // get hydrate function and hydrate
    // eslint-disable-next-line
    const hydrate = require(paths.appServerEntry).default;
    hydrate({ ...metaServerOnly, ...meta }, { error, redirect, render });
  };
};
