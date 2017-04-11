const paths = require('./paths');
const path = require('path');

const webpackConfig = process.env.NODE_ENV === 'development'
  ? path.join(paths.kickstarterConfig, "webpack.dev.js")
  : path.join(paths.kickstarterConfig, "webpack.prod.js");

module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "env": {
    "browser": true
  },
  "plugins": [
    "flowtype"
  ],
  "rules": {
    // airbnb
    "linebreak-style": "on",
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],

    // flowtype
    "flowtype/delimiter-dangle": ["error", "always-multiline"],
    "flowtype/no-primitive-constructor-types": "error",
    "flowtype/no-weak-types": "error",
    "flowtype/object-type-delimiter": ["error", "comma"],
    "flowtype/require-valid-file-annotation": "error",
    "flowtype/semi": ["error", "always"],
    "flowtype/space-before-generic-bracket": ["error", "never"],
    "flowtype/type-id-match": ["error", "^([A-Z][a-z0-9]+)+Type$"]
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": webpackConfig
      }
    }
  }
};
