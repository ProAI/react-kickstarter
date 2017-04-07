const serialize = require('serialize-javascript');

module.exports = function injectAssetsIntoHtml(html, meta, content, assets, data, useDll) {
  // generate styles html
  const stylesHtml = (process.env.APP_MODE === 'development')
    ? '<!-- styles are injected via hot loading in development -->'
    : `${(assets.styles.desktop && meta.device === 'desktop') ? `<link href="${assets.styles.desktop}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />` : ``}${(assets.styles.mobile && meta.device === 'mobile') ? `<link href="${assets.styles.mobile}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />` : ``}${(assets.styles.main) ? `<link href="${assets.styles.main}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />`: ``}`;

  // generate content html
  const contentHtml = `<div id="content">${content}</div>`;

  // generate javascript html
  const javascriptHtml = `<script charset="UTF-8">
      window.__DATA__=${data ? serialize(data) : '{}'};
      window.__METADATA__=${serialize(meta)};
    </script>
    ${(useDll && process.env.APP_MODE === 'development') ? `<script key="dll__vendor" src="/dist/dll/dll__vendor.js" charset="UTF-8" /></script>` : ``}
    ${(assets.javascript.desktop && meta.device === 'desktop') ? `<script src="${assets.javascript.desktop}" charset="UTF-8"></script>` : ``}${(assets.javascript.mobile && meta.device === 'mobile') ? `<script src="${assets.javascript.mobile}" charset="UTF-8"></script>` : ``}<script src="${assets.javascript.main}" charset="UTF-8"></script>`;

  // replace placeholders in html
  return html.replace('<% INCLUDE_STYLES %>', stylesHtml)
    .replace('<% REACT_CONTENT %>', contentHtml)
    .replace('<% INCLUDE_JAVASCRIPT %>', javascriptHtml);
}
