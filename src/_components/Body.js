import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

const propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
};

function Body({ assets, component, store, children }) {
  const content = component ? ReactDOM.renderToString(component) : '';

  return {
    <body>
      {/* content (can be rendered server- and clientside) */}
      <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

      {/* initial variables */}
      <script
        dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
        charSet="UTF-8"
      />

      {/* scripts */}
      {__DLLS__ && (
        <script key="dlls__vendor" src="/dist/dlls/dll__vendor.js" charSet="UTF-8" />
      )}
      <script src={assets.javascript.main} charSet="UTF-8" />

      {/* children */}
      {children}
    </body>
  }
});

Body.propTypes = propTypes;

export default Body;
