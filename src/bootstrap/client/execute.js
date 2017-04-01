import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
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

/* CUSTOM CODE START */
const render = (component) => {
  ReactDOM.render(component, dest);
};

// eslint-disable-next-line
const hydrate = require('client');

hydrate(meta, { render });
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
