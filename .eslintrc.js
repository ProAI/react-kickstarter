// Since most of the files in this project don't use ES6, we need to change a
// few rules from our base ESLint configuration.

module.exports = {
  extends: './src/config/eslint.js',
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
  },
};
