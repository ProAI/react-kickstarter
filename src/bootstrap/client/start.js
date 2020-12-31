// add polyfills
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

// import react-dom
import ReactDOM from 'react-dom';
import CookieJar from '../utils/CookieJar';

/* eslint-disable no-underscore-dangle */
const data = window.__DATA__;
const ctx = window.__CTX__;
/* eslint-enable */

const root = document.getElementById('content');

const ssr = root && root.firstChild;

// define render function for hydrate function
const render = component => {
  const element = component;

  if (ssr) {
    ReactDOM.hydrate(element, root);
  } else {
    ReactDOM.render(element, root);
  }
};

// get hydrate function and hydrate
// eslint-disable-next-line import/no-unresolved
const hydrate = require('appClientEntry').default;

const cookies = new CookieJar(document);

const headers = {
  create: () => ctx.network.csrfHeader,
};

const ctxClientOnly = {
  ...ctx,
  network: {
    ...ctx.network,
    cookies,
    headers,
  },
};

hydrate(ctxClientOnly, { render, root }, data);

if (process.env.APP_MODE === 'development' && !ssr) {
  // eslint-disable-next-line no-console
  console.warn('React server side rendering is not in use.');
}
