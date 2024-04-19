const CONTENT = Symbol('REACT_TRANSPORTER_CONTENT');

module.exports = function createHtml() {
  function html(strings, ...values) {
    return ({ onWrite, onContent }) => {
      let buffer = '';

      for (let i = 0; i < strings.length; i += 1) {
        const string = strings[i];
        const value = values[i] || '';

        switch (value) {
          case CONTENT: {
            buffer += '<div id="content" style="display:flex; flex-direction: column">';
            onWrite(buffer);
            onContent();
            buffer = '</div>';
            break;
          }
          default: {
            const valueToAppend = typeof value === 'function' ? value() : value;
            buffer += string + valueToAppend;
          }
        }
      }

      onWrite(buffer);
    };
  }

  html.content = CONTENT;

  return html;
};
