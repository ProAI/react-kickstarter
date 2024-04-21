const ReactDOMServer = require('react-dom/server');
const path = require('path');
const createHtml = require('./createHtml');
const paths = require('../../config/paths');

module.exports = function createAppOnServer() {
  return (req, res) => {
    // define render, redirect and error function for hydrate function
    const render = (component, config) => {
      // eslint-disable-next-line
      const assets = require(paths.webpackManifest);

      // eslint-disable-next-line
      const getHtmlTemplate = require(paths.appHtml);

      const html = createHtml(assets);
      const process = getHtmlTemplate(html, config.htmlData);

      res.statusCode = 200;
      res.setHeader('content-type', 'text/html');

      if (!config.ssr) {
        process({
          onWrite(buffer) {
            res.write(buffer);
          },
          onRoot() {},
        });

        res.end();
      }

      let hasShellError = false;

      const stream = ReactDOMServer.renderToPipeableStream(component, {
        onShellReady() {
          if (!config.stream) {
            return;
          }

          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onRoot() {
              stream.pipe(res);
            },
          });
        },
        onAllReady() {
          if (config.stream || hasShellError) {
            return;
          }

          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onRoot() {
              stream.pipe(res);
            },
          });
        },
        onShellError() {
          hasShellError = true;

          // Do not server side render page after error and try again on client.
          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onRoot() {},
          });

          res.end();
        },
        onError(err) {
          // eslint-disable-next-line no-console
          console.error(err);
        },
      });
    };

    const entryFolder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    const entry = path.join(paths.webpackCache, entryFolder, 'server-bundle.js');

    // get hydrate function and hydrate
    // eslint-disable-next-line
    const hydrate = require(entry).default;

    hydrate({ render, req, res });
  };
};
