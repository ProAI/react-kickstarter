const ReactDOMServer = require('react-dom/server');
const path = require('path');
const cookie = require('cookie');
const detectDevice = require('./utils/detectDevice');
const detectLocale = require('./utils/detectLocale');
const handleCsrfProtection = require('./utils/handleCsrfProtection');
const getRealPath = require('./utils/getRealPath');
const generateHtmlSnippets = require('./utils/generateHtmlSnippets');
const paths = require('../../config/paths');

const getCookies = (req, res) => {
  const cache = cookie.parse(req.headers.cookie);

  return {
    get(name) {
      return cache[name];
    },
    set(name, value, options) {
      res.cookie(name, value, options);
    },
  };
};

module.exports = function createAppOnServer(config) {
  return (req, res) => {
    const cookies = getCookies(req, res);
    const userAgent = req.headers['user-agent'];
    const { url } = req;

    const [locale, localeSource] = detectLocale(req, cookies, config.intl);
    const device = detectDevice(userAgent, cookies, config.device);
    const csrf = handleCsrfProtection(cookies, config.csrf);
    const [basename, realPath] = getRealPath(url, locale, localeSource);

    const ctx = {
      basename,
      path: realPath,
      ssr: config.ssr,
      csrf,
      device,
      intl: {
        locale,
        localeSource,
        defaultLocale: config.intl.defaultLocale,
        locales: config.intl.locales,
      },
    };

    const ctxServerOnly = {
      req,
      res,
      ...ctx,
    };

    // define render, redirect and error function for hydrate function
    const render = (component, getData, meta) => {
      // eslint-disable-next-line
      const assets = require(paths.webpackManifest);
      const content = component ? ReactDOMServer.renderToString(component) : '';
      // eslint-disable-next-line
      const renderHtml = require(paths.appHtml);

      const snippets = generateHtmlSnippets(ctx, content, assets, getData ? getData() : {});

      const html = renderHtml(ctxServerOnly, snippets, meta);

      res.status(200).send(html);
    };

    const redirect = (location) => {
      res.redirect(location);
    };

    const error = (status, message) => {
      if (message) {
        res.status(status).send(message);
      } else {
        res.status(status).end();
      }
    };

    // Render page on client if server side rendering is disabled.
    // Initial state should be empty in this case.
    if (!config.ssr) {
      render();
      return;
    }

    const entryFolder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    const entry = path.join(paths.webpackCache, entryFolder, 'server-bundle.js');

    // get hydrate function and hydrate
    // eslint-disable-next-line
    const hydrate = require(entry).default;

    hydrate(ctxServerOnly, { error, redirect, render });
  };
};
