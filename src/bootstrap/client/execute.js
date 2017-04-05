import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import getLocaleFromUrl from '../utils/getLocaleFromUrl';
// import 'isomorphic-fetch';

// get locale
const locale = document.getElementsByTagName('html')[0].getAttribute('lang');
const localeFromUrl = getLocaleFromUrl(window.location.pathname, ['de', 'en']); // todo

// basename
const basename = localeFromUrl ? `/${localeFromUrl}` : '';

// create meta data object
const meta = {
  locale,
  localeFromUrl,
  basename,
};

const dest = document.getElementById('content');

// define render function for hydrate function
const render = component => {
  ReactDOM.render(<HotEnabler>{component}</HotEnabler>, dest);
};

// get hydrate function and hydrate
// eslint-disable-next-line
const hydrate = require('client');
hydrate(meta, { render });

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
