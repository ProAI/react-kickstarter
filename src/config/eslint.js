module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": {
    "linebreak-style": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
  },
  "globals": {
    "webpackIsomorphicTools": null,
  }
};
