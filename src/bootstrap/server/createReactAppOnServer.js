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

      const html = createHtml();
      const process = getHtmlTemplate(html, config.htmlData);

      if (!config.ssr) {
        process({
          onWrite(buffer) {
            res.write(buffer);
          },
          onContent() {},
        });

        res.end();
      }

      const stream = ReactDOMServer.renderToPipeableStream(component, {
        bootstrapScripts: [assets['main.js']],
        onShellReady() {
          if (!config.stream) {
            return;
          }

          res.statusCode = 200;
          res.setHeader('content-type', 'text/html');

          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onContent() {
              stream.pipe(res);
            },
          });
        },
        onAllReady() {
          if (config.stream) {
            return;
          }

          res.statusCode = 200;
          res.setHeader('content-type', 'text/html');

          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onContent() {
              stream.pipe(res);
            },
          });
        },
        onShellError(err) {
          res.statusCode = 500;
          res.setHeader('content-type', 'text/html');

          process({
            onWrite(buffer) {
              res.write(buffer);
            },
            onContent() {
              if (config.onError) {
                config.onError(err);
              } else {
                res.send('<h1>Something went wrong</h1>');
              }
            },
          });
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
