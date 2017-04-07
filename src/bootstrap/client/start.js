import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotEnabler } from 'react-hot-loader';
// import 'isomorphic-fetch';

// eslint-disable-next-line no-underscore-dangle
const data = window.__DATA__;

// eslint-disable-next-line no-underscore-dangle
const meta = window.__METADATA__;

const dest = document.getElementById('content');

// define render function for hydrate function
const render = component => {
  ReactDOM.render(<HotEnabler>{component}</HotEnabler>, dest);
};

// get hydrate function and hydrate
// eslint-disable-next-line
const hydrate = require('client');
hydrate(meta, { render }, data);

if (process.env.APP_MODE === 'development') {
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
