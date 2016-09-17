import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { match, applyRouterMiddleware, useRouterHistory, Router } from 'react-router';
import { createHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import { useScroll } from 'react-router-scroll';
import createStore from './start/store/createStore';
import Api from './utils/Api';
import Locale from './utils/Locale';
import getRoutes from './routes';

export default function bootstrapReactAppOnClient(config) {
  return () => {
    const localeFromUrl = Locale.getUrlLocale();
    const basename = localeFromUrl ? `/${localeFromUrl}` : '';
    const browserHistory = useRouterHistory(createHistory)({ basename });

    const dest = document.getElementById('content');

    // eslint-disable-next-line no-underscore-dangle
    const store = createStore(browserHistory, Api, window.__data);

    const history = syncHistoryWithStore(browserHistory, store);

    const currentRoutes = getRoutes(store, basename);

    const render = routes => {
      ReactDOM.render(
        <HotEnabler>
          <Provider store={store} key="provider">
            <Router
              render={(props) =>
                <ReduxAsyncConnect
                  {...props}
                  helpers={{ Api }}
                  filter={item => !item.deferred}
                  render={applyRouterMiddleware(useScroll())}
                />
              }
              history={history}
              routes={routes}
            />
          </Provider>
        </HotEnabler>,
        dest
      );
    };

    match({ history, currentRoutes }, () => {
      render(currentRoutes);

      if (module.hot) {
        /**
         * Warning from React Router, caused by react-hot-loader.
         * The warning can be safely ignored, so filter it from the console.
         * Otherwise you'll see it every time something changes.
         * See https://github.com/gaearon/react-hot-loader/issues/298
         */
        const orgError = console.error; // eslint-disable-line no-console
        console.error = (message) => { // eslint-disable-line no-console
          if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
            // Log the error as normally
            orgError.apply(console, [message]);
          }
        };

        module.hot.accept('./routes', () => {
          // eslint-disable-next-line global-require
          const nextRoutes = require('./routes')(store, basename);

          render(nextRoutes);
        });
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      window.React = React; // enable debugger

      if (!dest
        || !dest.firstChild
        || !dest.firstChild.attributes
        || !dest.firstChild.attributes['data-react-checksum']
      ) {
        // eslint-disable-next-line no-console
        console.error(`
          Server-side React render was discarded.
          Make sure that your initial render does not contain any client-side code.
        `);
      }
    }

    if (__DEVTOOLS__ && !window.devToolsExtension) {
      const devToolsDest = document.createElement('div');
      window.document.body.insertBefore(devToolsDest, null);
      // eslint-disable-next-line global-require
      const DevTools = require('./components/app/devTools/DevTools');

      ReactDOM.render(
        <Provider store={store} key="provider">
          <DevTools />
        </Provider>,
        devToolsDest
      );
    }
  };
};
