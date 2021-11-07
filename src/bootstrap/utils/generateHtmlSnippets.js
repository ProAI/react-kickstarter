const serialize = require('serialize-javascript');

function createPreloadTag(href, as, extra) {
  return `<link rel="preload" href="${href}"${extra ? ` ${extra}` : ''} as="${as}" />`;
}

function createStyleTag(href) {
  return `<link rel="stylesheet" href="${href}" />`;
}

function createScriptTag(src, extra) {
  return `<script src="${src}"${extra ? ` ${extra}` : ''}></script>`;
}

module.exports = function generateHtmlSnippets(ctx, reactContent, assets, data) {
  const preloads = [];

  // generate styles html
  const styles = [];
  if (process.env.NODE_ENV === 'development') {
    styles.push('<!-- styles are injected via hot loading in development -->');
  } else {
    if (assets['desktop.css'] && ctx.media.device !== 'mobile') {
      preloads.push(createPreloadTag(assets['desktop.css'], 'style'));
      styles.push(createStyleTag(assets['desktop.css']));
    }
    if (assets['mobile.css'] && ctx.media.device === 'mobile') {
      preloads.push(createPreloadTag(assets['mobile.css'], 'style'));
      styles.push(createStyleTag(assets['mobile.css']));
    }
    if (assets['main.css']) {
      preloads.push(createPreloadTag(assets['main.css'], 'style'));
      styles.push(createStyleTag(assets['main.css']));
    }
  }

  // generate content html
  const content = `<div id="content">${reactContent}</div>`;

  // generate javascript html
  const scripts = [];
  scripts.push(`<script>window.__DATA__=${serialize(data)};</script>`);
  scripts.push(`<script>window.__CTX__=${serialize(ctx)};</script>`);

  const crossOrigin = process.env.NODE_ENV === 'development' ? 'crossorigin' : null;
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
