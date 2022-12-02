const ReactDOMServer = require('react-dom/server');
const path = require('path');
const detectDevice = require('./utils/detectDevice');
const detectLocale = require('./utils/detectLocale');
const getRealPath = require('./utils/getRealPath');
const generateHtmlSnippets = require('./utils/generateHtmlSnippets');
const paths = require('../../config/paths');

module.exports = function createAppOnServer(config) {
  return (req, res) => {
    const { url } = req;

    const [locale, localeSource] = detectLocale(req, config.intl);
    const device = detectDevice(req, config.device);
    const [basename, realPath] = getRealPath(url, locale, localeSource);

    const ctx = {
      basename,
      path: realPath,
      ssr: config.ssr,
      device,
      intl: {
        locale,
        localeSource,
        defaultLocale: config.intl.defaultLocale,
        locales: config.intl.locales,
      },
    };

    // define render, redirect and error function for hydrate function
    const render = (component, data, meta) => {
      // eslint-disable-next-line
      const assets = require(paths.webpackManifest);
      const content = component ? ReactDOMServer.renderToString(component) : '';
      // eslint-disable-next-line
      const renderHtml = require(paths.appHtml);

      const snippets = generateHtmlSnippets(ctx, content, assets, data);

      const html = renderHtml(ctx, snippets, meta);

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

    hydrate(ctx, { error, redirect, render, req, res });
  };
};
