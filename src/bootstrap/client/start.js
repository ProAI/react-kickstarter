// add polyfills
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

// import react-dom
import ReactDOMClient from 'react-dom/client';

const root = document.getElementById('root');

const ssr = root && root.firstChild;

// define render function for hydrate function
const render = (component) => {
  const element = component;

  if (ssr) {
    ReactDOMClient.hydrateRoot(root, element);
  } else {
    const reactRoot = ReactDOMClient.createRoot(root);
    reactRoot.render(element);
  }
};

// get hydrate function and hydrate
// eslint-disable-next-line import/no-unresolved
const hydrate = require('appClientEntry').default;

hydrate({ render, root, ssr });

if (process.env.APP_MODE === 'development' && !ssr) {
  // eslint-disable-next-line no-console
  console.warn('React server side rendering is not in use.');
}
