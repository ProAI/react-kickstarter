import React, { PropTypes } from 'react';
import Head from './Head';
import Body from './Body';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
const propTypes = {
  assets: PropTypes.object,
  meta: PropTypes.object,
  url: PropTypes.string,
  component: PropTypes.node,
  store: PropTypes.object,
};

function Html({ assets, meta, url, component, store }) {
  return (
    <html lang={meta.locale}>
      <Head assets={assets} meta={meta} url={url} />
      <Body assets={assets} component={component} store={store} />
    </html>
  );
}

Html.propTypes = propTypes;

export default Html;
