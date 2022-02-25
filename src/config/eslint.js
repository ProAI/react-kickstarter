module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:flowtype/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
  plugins: ['flowtype'],
  rules: {
    // eslint
    'arrow-body-style': 'off',

    // flowtype
    'flowtype/space-after-type-colon': 'off', // conflict with prettier

    // import
    'import/prefer-default-export': 'off', // conflict when there is only 1 action

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',

    // react
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off', // we can allow spreading, because objects are well defined by Flow
    'react/jsx-one-expression-per-line': 'off', // conflict with prettier
    'react/jsx-indent': 'off', // conflict with prettier
    'react/jsx-wrap-multilines': 'off', // conflict with prettier
    'react/jsx-closing-tag-location': 'off', // conflict with prettier
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app'],
      },
    },
  },
};
