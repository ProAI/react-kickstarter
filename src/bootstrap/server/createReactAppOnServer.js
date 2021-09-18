const ReactDOMServer = require('react-dom/server');
const path = require('path');
const CookieJar = require('../utils/CookieJar');
const detectDevice = require('../utils/detectDevice');
const detectLocale = require('../utils/detectLocale');
const handleCsrfProtection = require('../utils/handleCsrfProtection');
const getRealPath = require('../utils/getRealPath');
const generateHtmlSnippets = require('../utils/generateHtmlSnippets');
const paths = require('../../config/paths');

module.exports = function createAppOnServer(config) {
  return (req, res) => {
    const cookies = new CookieJar(req, res);

    const [locale, localeSource] = detectLocale(req, cookies, config.intl);
    const device = detectDevice(req, cookies, config.media);
    const csrfHeader = handleCsrfProtection(cookies, config.network);
    const [basename, realPath] = getRealPath(req, locale, localeSource);

    const ctx = {
      basename,
      path: realPath,
      ssr: config.ssr,
      network: {
        csrfHeader,
      },
      media: {
        device,
      },
      intl: {
        locale,
        localeSource,
        defaultLocale: config.intl.defaultLocale,
        locales: config.intl.locales,
      },
    };

    const headers = {
      create: () => ({
        cookie: cookies.serialize(),
        ...csrfHeader,
      }),
    };

    const ctxServerOnly = {
      ...ctx,
      req,
      res,
      network: {
        ...ctx.network,
        cookies,
        headers,
      },
    };

    // Do not cache webpack-manifest.json and all files in /app folder in development
    // See https://github.com/ProAI/react-kickstarter/issues/4
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[paths.webpackManifest];

      Object.keys(require.cache).forEach((id) => {
        if (/[/\\]app[/\\]/.test(id)) delete require.cache[id];
      });
    }

    // define render, redirect and error function for hydrate function
    const render = (component, getData, meta) => {
      // eslint-disable-next-line
      const assets = require(paths.webpackManifest);
      const content = component ? ReactDOMServer.renderToString(component) : '';
      // eslint-disable-next-line
      const renderHtml = require(paths.appHtml);

      const snippets = generateHtmlSnippets(
        ctx,
        content,
        assets,
        getData ? getData() : {},
        config.devBuild.dll,
      );

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

    const entry =
      process.env.NODE_ENV === 'development'
        ? paths.appServerEntry
        : path.join(paths.webpackCache, 'prod', 'server-bundle.js');

    // get hydrate function and hydrate
    // eslint-disable-next-line
    const hydrate = require(entry).default;

    hydrate(ctxServerOnly, { error, redirect, render });
  };
};
