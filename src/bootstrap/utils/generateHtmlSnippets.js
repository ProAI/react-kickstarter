const serialize = require('serialize-javascript');

function createPreloadTag(href, as, extra) {
  return `<link rel="preload" href="${href}"${extra ? ` ${extra}` : ''} as="${as}" />`;
}

function createScriptTag(src, extra) {
  return `<script src="${src}"${extra ? ` ${extra}` : ''}></script>`;
}

module.exports = function generateHtmlSnippets(ctx, reactContent, assets, data) {
  const scripts = [];
  const preloads = [];

  // generate content html
  const content = `<div id="content" style="display:flex; flex-direction: column">${reactContent}</div>`;

  // generate javascript html
  scripts.push(`<script>window.__DATA__=${serialize(data)};</script>`);
  scripts.push(`<script>window.__CTX__=${serialize(ctx)};</script>`);

  const crossOrigin = process.env.NODE_ENV === 'development' ? 'crossorigin' : null;
  preloads.push(createPreloadTag(assets['main.js'], 'script', crossOrigin));
  scripts.push(createScriptTag(assets['main.js'], crossOrigin));

  // bundle html snippets
  return {
    preloads,
    content,
    scripts,
  };
};
