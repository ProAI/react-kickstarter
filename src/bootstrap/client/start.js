import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotEnabler } from 'react-hot-loader';
// import 'isomorphic-fetch';

// eslint-disable-next-line no-underscore-dangle
const data = window.__DATA__;

// eslint-disable-next-line no-underscore-dangle
const meta = window.__METADATA__;

const dest = document.getElementById('content');

const ssr =
  dest &&
  dest.firstChild &&
  dest.firstChild.attributes &&
  dest.firstChild.attributes['data-reactroot'];

// backwards compatibility for React 15
const isReact15 = ReactDOM.createPortal === undefined;

// define render function for hydrate function
const render = component => {
  const element = React.createElement(HotEnabler, {}, component);

  if (!isReact15 && ssr) {
    ReactDOM.hydrate(element, dest);
  } else {
    ReactDOM.render(element, dest);
  }
};

// get hydrate function and hydrate
// eslint-disable-next-line
const hydrate = require('appClientEntry').default;
hydrate(meta, { render }, data);

if (process.env.APP_MODE === 'development') {
  window.React = React; // enable debugger

  if (!ssr) {
    // eslint-disable-next-line no-console
    console.error('React server side rendering is disabled or was discarded.');
  }
}
