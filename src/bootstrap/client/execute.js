import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import paths from '../../config/paths';
import 'isomorphic-fetch';

const meta = {};
// get locale

/* CUSTOM CODE START */
const render = (component) => {
  ReactDOM.render(component, document.getElementById('content'));
};

// todo: import hydrate function
const hydrate = require(paths.clientEntry);

hydrate(meta, {
  render
});
/* CUSTOM CODE END */

if (__DEVELOPMENT__) {
  window.React = React; // enable debugger

  if (!dest
    || !dest.firstChild
    || !dest.firstChild.attributes
    || !dest.firstChild.attributes['data-react-checksum']
  ) {
    // eslint-disable-next-line no-console
    console.error(`
      Server-side React render was discarded.
      Make sure that your initial render does not contain any client-side code.
    `);
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const devToolsDest = document.createElement('div');
  window.document.body.insertBefore(devToolsDest, null);
  // eslint-disable-next-line global-require
  const DevTools = require('./components/app/devTools/DevTools');

  ReactDOM.render(
    <Provider store={store} key="provider">
      <DevTools />
    </Provider>,
    devToolsDest
  );
}
