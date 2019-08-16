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
    // import
    'import/prefer-default-export': 'off', // conflict when there is only 1 action

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',

    // react
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off', // we can allow spreading, because objects are well defined by Flow
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app'],
      },
    },
  },
};
