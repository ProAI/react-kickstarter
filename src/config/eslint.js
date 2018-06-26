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

    // general
    'linebreak-style': 'off',
    'arrow-parens': 'off', // not necessary with Prettier

    // flowtype
    // 'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    // 'flowtype/no-primitive-constructor-types': 'error',
    // 'flowtype/object-type-delimiter': ['error', 'comma'],
    // 'flowtype/require-valid-file-annotation': 'error',
    // 'flowtype/semi': ['error', 'always'],
    // 'flowtype/space-before-generic-bracket': ['error', 'never'],

    // import
    'import/prefer-default-export': 'off', // conflict when there is only 1 action

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',

    // react
    'react/no-unknown-property': 'off',
    'react/jsx-pascal-case': ['error', { allowAllCaps: true, ignore: ['_'] }], // can be removed after update to babel 7
    'react/no-unused-prop-types': 'off', // conflict with Flow type defs
    'react/prop-types': 'off', // not necessary with Flow
    'react/default-props-match-prop-types': 'off', // conflict with Flow v0.57.3
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/resolver': {
      // TODO - Verfiy we don't need eslint-import-resolver-webpack anymore
      // "webpack": {
      //   "config": webpackConfig
      // },
      node: {
        paths: [paths.appMain, paths.appResources],
      },
    },
  },
};
