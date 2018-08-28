const serialize = require('serialize-javascript');

module.exports = function generateHtmlSnippets(meta, reactContent, assets, data, useDll) {
  // generate styles html
  const styles =
    process.env.APP_MODE === 'development'
      ? '<!-- styles are injected via hot loading in development -->'
      : `${
        assets['desktop.css'] && meta.device === 'desktop'
          ? `<link href="${
            assets['desktop.css']
          }" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />`
          : ''
      }${
        assets['mobile.css'] && meta.device === 'mobile'
          ? `<link href="${
            assets['mobile.css']
          }" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />`
          : ''
      }${
        assets['main.css']
          ? `<link href="${
            assets['main.css']
          }" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />`
          : ''
      }`;

  // generate content html
  const content = `<div id="content">${reactContent}</div>`;

  // generate javascript html
  const scripts = `<script charset="UTF-8">
      window.__DATA__=${serialize(data)};
      window.__METADATA__=${serialize(meta)};
    </script>
    ${
  useDll && process.env.APP_MODE === 'development'
    ? '<script key="dll__vendor" src="/dll/dll__vendor.js" charset="UTF-8" /></script>'
    : ''
}
    <script ${process.env.APP_MODE === 'development' ? 'crossorigin ' : ''} src="${
  assets['main.js']
}" charset="UTF-8"></script>`;

  // bundle html snippets
  return {
    styles,
    content,
    scripts,
  };
};
