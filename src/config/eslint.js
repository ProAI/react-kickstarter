const paths = require('./paths');

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['flowtype'],
  rules: {
    // airbnb config modifications

    // import
    'import/prefer-default-export': 'off', // conflict when there is only 1 action

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',

    // react
    'react/no-unknown-property': 'off',
    'react/jsx-pascal-case': ['error', { allowAllCaps: true, ignore: ['_'] }], // can be removed after update to babel 7
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [paths.appMain, paths.appResources],
      },
    },
  },
};
