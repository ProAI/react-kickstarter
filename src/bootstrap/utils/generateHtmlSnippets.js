const serialize = require('serialize-javascript');

module.exports = function generateHtmlSnippets(meta, reactContent, assets, data, useDll) {
  // generate styles html
  const styles = (process.env.APP_MODE === 'development')
    ? '<!-- styles are injected via hot loading in development -->'
    : `${(assets.styles.desktop && meta.device === 'desktop') ? `<link href="${assets.styles.desktop}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />` : ``}${(assets.styles.mobile && meta.device === 'mobile') ? `<link href="${assets.styles.mobile}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />` : ``}${(assets.styles.main) ? `<link href="${assets.styles.main}" media="all" rel="stylesheet" type="text/css" charset="UTF-8" />`: ``}`;

  // generate content html
  const content = `<div id="content">${reactContent}</div>`;

  // generate javascript html
  const javascript = `<script charset="UTF-8">
      window.__DATA__=${data ? serialize(data) : '{}'};
      window.__METADATA__=${serialize(meta)};
    </script>
    ${(useDll && process.env.APP_MODE === 'development') ? `<script key="dll__vendor" src="/dll/dll__vendor.js" charset="UTF-8" /></script>` : ``}
    ${(assets.javascript.desktop && meta.device === 'desktop') ? `<script src="${assets.javascript.desktop}" charset="UTF-8"></script>` : ``}${(assets.javascript.mobile && meta.device === 'mobile') ? `<script src="${assets.javascript.mobile}" charset="UTF-8"></script>` : ``}<script src="${assets.javascript.main}" charset="UTF-8"></script>`;

  // bundle html snippets
  return {
    styles,
    content,
    javascript,
  };
}
