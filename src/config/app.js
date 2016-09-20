module.exports = {
  routes: require('../redux/routes'),
  htmlComponent: require('../components/Html'),
  csrfToken: true,
  locale: {
    autoDetect: true,
    default: 'en',
    supported: ['en'],
    urlPrefix: true,
  },
  device: {
    autoDetect: true
  },
  redux: {
    enable: true,
    useInfoReducer: true,
    store: require('../redux/configureStore'),
    fetch: require('../redux/fetch'),
  },
  /* build: {
    dlls: false,
    happypack: false
  }*/
};