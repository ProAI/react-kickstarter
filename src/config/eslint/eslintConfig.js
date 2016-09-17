module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": {
    "linebreak-style": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }]
  },
  "globals": {
    "__DEVELOPMENT__": true,
    "__CLIENT__": true,
    "__SERVER__": true,
    "__DISABLE_SSR__": true,
    "__DEVTOOLS__": true,
    "__DLLS__": true,
    "webpackIsomorphicTools": true
  }
};
