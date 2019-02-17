const serialize = require('serialize-javascript');

function createPreloadTag(href, as, extra) {
  return `<link rel="preload" href="${href}"${extra ? ` ${extra}` : ''} as="${as}" />`;
}

function createStyleTag(href) {
  return `<link rel="stylesheet" href="${href}" />`;
}

function createScriptTag(src, extra) {
  return `<script src="${src}"${extra ? ` ${extra}` : ''} /></script>`;
}

module.exports = function generateHtmlSnippets(meta, reactContent, assets, data, useDll) {
  const preloads = [];

  // generate styles html
  const styles = [];
  if (process.env.APP_MODE === 'development') {
    styles.push('<!-- styles are injected via hot loading in development -->');
  } else {
    if (assets['desktop.css'] && meta.device === 'desktop') {
      preloads.push(createPreloadTag(assets['desktop.css'], 'style'));
      styles.push(createStyleTag(assets['desktop.css']));
    }
    if (assets['mobile.css'] && meta.device === 'mobile') {
      preloads.push(createPreloadTag(assets['mobile.css'], 'style'));
      styles.push(createStyleTag(assets['mobile.css']));
    }
    if (assets['main.css']) {
      preloads.push(createPreloadTag(assets['desktop.css'], 'style'));
      styles.push(createStyleTag(assets['main.css']));
    }
  }

  // generate content html
  const content = `<div id="content">${reactContent}</div>`;

  // generate javascript html
  const scripts = [];
  scripts.push(`<script>window.__DATA__=${serialize(data)};</script>`);
  scripts.push(`<script>window.__METADATA__=${serialize(meta)};</script>`);

  if (useDll && process.env.APP_MODE === 'development') {
    preloads.push(createPreloadTag('/dll/dll__vendor.js', 'script'));
    scripts.push(createScriptTag('/dll/dll__vendor.js', 'key="dll__vendor"'));
  }

  const crossOrigin = process.env.APP_MODE === 'development' ? 'crossorigin' : null;
  preloads.push(createPreloadTag(assets['main.js'], 'script', crossOrigin));
  scripts.push(createScriptTag(assets['main.js'], crossOrigin));

  // bundle html snippets
  return {
    preloads,
    styles,
    content,
    scripts,
  };
};
