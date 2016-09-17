import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const propTypes = {
  assets: PropTypes.object,
  meta: PropTypes.object,
  url: PropTypes.object,
  children: PropTypes.node,
};

function Head({ assets, meta, url, children }) {
  const head = Helmet.rewind();
  const viewport = (meta.device === 'desktop')
    ? 'width=1080'
    : 'width=device-width, initial-scale=1';

  return {
    <head>
      {/* Helmet meta tags */}
      {head.base.toComponent()}
      {head.title.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      {head.script.toComponent()}

      {/* SEO language links */}
      <link rel="alternate" hrefLang="x-default" href={`https://www.examunity.com${url}`} />
      <link rel="alternate" hrefLang="en" href={`https://www.examunity.com/en${url}`} />
      <link rel="alternate" hrefLang="de" href={`https://www.examunity.com/de${url}`} />

      {/* meta tags */}
      {meta.favicon && (
        <link rel="shortcut icon" href={meta.favicon} />
      )}
      {meta.csrfToken && (
        <meta name="csrf" content={meta.csrfToken} />
      )}
      <meta name="viewport" content={viewport} />

      {/* assets (will be present only in production with webpack extract text plugin) */}
      {Object.keys(assets.styles).map((style, key) => {
        if (style === 'main' || style === view) {
          return (
            <link
              href={assets.styles[style]}
              key={key}
              media="all"
              rel="assetsheet"
              type="text/css"
              charSet="UTF-8"
            />
          );
        }

        return null;
      })}

      {/* children */}
      {children}
    </head>
  }
});

Head.propTypes = propTypes;

export default Html;
