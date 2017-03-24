import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return process.env.API_URL + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return `/api${adjustedPath}`;
}

export default class ApiClient {
  constructor(req, res) {
    methods.forEach((method) => {
      this[method] = (
        path, { params, data, attach, field } = {}
      ) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        const queryParams = params;
        if (queryParams) {
          // compress params for multi packages get request
          if (queryParams.packages) {
            queryParams.packages = JSON.stringify(queryParams.packages, null, '');
          }
          request.query(queryParams);
        }

        // set cookies (serverside) and csrf token header
        let csrfToken;
        if (__SERVER__) {
          csrfToken = req.cookies.csrf;

          if (req.get('cookie')) {
            request.set('cookie', req.get('cookie'));
          }
        } else {
          csrfToken = document.getElementsByTagName('meta').csrf.getAttribute('content');
        }
        request.set('X-Csrf-Token', csrfToken);

        // request wants json
        request.set('Accept', 'application/json');

        if (data) {
          request.send(data);
        }

        if (attach) {
          attach.foreach(item => request.attach(item.key, item.value));
        }

        if (field) {
          field.forEach(item => request.field(item.key, item.value));
        }

        request.end((err, { body, headers } = {}) => {
          // serverside actions
          if (__SERVER__) {
            // debug info
            if (__DEVELOPMENT__) {
              // eslint-disable-next-line no-console
              console.log(`Http Request (${path})`);
            }

            // relay cookies to client
            if (headers && headers['set-cookie']) {
              res.append('Set-Cookie', headers['set-cookie']);
            }
          }

          // log errors, reject or resolve
          if (err) {
            const source = (__SERVER__) ? (` (${path})`) : '';
            if (body && body.error) {
              // eslint-disable-next-line no-console
              console.error(`Http Error ${err.status}: ${body.error}${source}`);
            } else if (__SERVER__) {
              // eslint-disable-next-line no-console
              console.error(`Http Error ${err.status}${source}`);
            }
            reject(body || err);
          } else {
            resolve(body);
          }
        });
      });
    });
  }

  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
