import ReactDOM from 'react-dom';
// import 'isomorphic-fetch';

// eslint-disable-next-line no-underscore-dangle
const data = window.__DATA__;

// eslint-disable-next-line no-underscore-dangle
const meta = window.__METADATA__;

const root = document.getElementById('content');

const ssr = root && root.firstChild;

// backwards compatibility for React 15
const isReact15 = ReactDOM.createPortal === undefined;

// define render function for hydrate function
const render = component => {
  const element = component;

  if (!isReact15 && ssr) {
    ReactDOM.hydrate(element, root);
  } else {
    ReactDOM.render(element, root);
  }
};

// get hydrate function and hydrate
// eslint-disable-next-line
const hydrate = require('appClientEntry').default;
hydrate(meta, { render, root }, data);

if (process.env.APP_MODE === 'development' && !ssr) {
  // eslint-disable-next-line no-console
  console.warn('React server side rendering is not in use.');
}
