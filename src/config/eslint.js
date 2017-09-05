const paths = require('./paths');

// TODO - Verfiy that we don't need eslint-import-resolver-webpack anymore
// const webpackConfig = process.env.NODE_ENV === "development"
//   ? path.join(paths.kickstarterConfig, "webpack.dev.js")
//   : path.join(paths.kickstarterConfig, "webpack.prod.js");

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['flowtype'],
  rules: {
    // airbnb config modifications
    'no-unused-vars': 'warn', // easier for development
    'linebreak-style': 'off',
    'react/prop-types': 'off', // disable rule until update to Flow v0.53
    'arrow-parens': 'off', // conflict with Prettier
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // flowtype
    'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-valid-file-annotation': 'error',
    'flowtype/semi': ['error', 'always'],
    'flowtype/space-before-generic-bracket': ['error', 'never'],
  },
  settings: {
    'import/resolver': {
      // TODO - Verfiy we don't need eslint-import-resolver-webpack anymore
      // "webpack": {
      //   "config": webpackConfig
      // },
      node: {
        paths: [paths.appMain],
      },
    },
  },
};
