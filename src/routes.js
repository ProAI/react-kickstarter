/* eslint-disable global-require */

import { isLoaded as isAuthLoaded, load as loadAuth } from './actions/user/auth';

// fix for react-hot-loader
// https://github.com/gaearon/react-hot-loader/issues/288
if (process.env.NODE_ENV !== 'production') {
  require('./components/views/FormPage');
}

export default (store, basename) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  // fix for dynamic routing basename
  const addBasename = (nextState) => {
    // eslint-disable-next-line no-param-reassign
    nextState.location.basename = basename;
  };

  if (typeof require.ensure !== 'function') {
    require.ensure = (deps, cb) => cb(require);
  }

  /**
   * Please keep routes in alphabetical order
   */
  return {
    path: '/',
    component: require('./components/app/layout/App'),
    indexRoute: {
      component: require('./components/page/home/Home'),
    },
    childRoutes: [{
      onEnter: requireLogin,
      childRoutes: [{
        path: 'loginSuccess',
        component: require('./components/user/loginSuccess/LoginSuccess'),
      }],
    }, {
      path: 'about',
      component: require('./components/page/about/About'),
    }, {
      path: 'login',
      component: require('./components/user/login/Login'),
    }, {
      path: 'elements',
      component: require('./components/views/Elements'),
    },
    {
      path: 'form',
      getComponent: (nextState, cb) => {
        addBasename(nextState);

        require.ensure([], require => {
          cb(null, require('./components/views/FormPage'));
        });
      },
    }, {
      path: 'sheet',
      component: require('./components/views/Sheet'),
    }, {
      path: '*',
      component: require('./components/app/error/NotFound'),
      status: 404,
    }],
  };
};
