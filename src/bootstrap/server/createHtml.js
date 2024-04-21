const ROOT = Symbol('REACT_TRANSPORTER_ROOT');
const SCRIPTS = Symbol('REACT_TRANSPORTER_SCRIPTS');

module.exports = function createHtml(assets) {
  function html(strings, ...values) {
    return ({ onWrite, onRoot }) => {
      let buffer = '';

      for (let i = 0; i < strings.length; i += 1) {
        const string = strings[i];
        const value = values[i] || '';

        buffer += string;

        switch (value) {
          case ROOT: {
            buffer += '<div id="root">';
            onWrite(buffer);
            onRoot();
            buffer = '</div>';
            break;
          }
          case SCRIPTS: {
            buffer += `<script src="${assets['main.js']}" async=""></script>`;
            break;
          }
          default: {
            buffer += typeof value === 'function' ? value() : value;
          }
        }
      }

      onWrite(buffer);
    };
  }

  html.root = ROOT;
  html.scripts = SCRIPTS;

  return html;
};
