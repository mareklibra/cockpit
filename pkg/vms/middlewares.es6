import cockpit from 'cockpit';
import { setProvider } from 'vms/actions';
import Machined from 'vms/machined';

export function thunk({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
}

function getVirtProvider (store) {
  const state = store.getSteate();
  if (state.config.provider) {
    return cockpit.resolve(state.config.provider);
  } else {
    const deferred = cockpit.defer();
    // TODO: discover host capabilities by dispatching dbus() actions

    if (true /* TODO: detect machined */) {
      store.dispatch(setProvider(Machined));
      deferred.resolve(Machined);
    }

    return deferred.promise;
  }
}

export function virt(store) {
  return next => action => {
    if (action.type === 'VIRT') {
      getVirtProvider(store).then(provider => {
        const method = action.method;
        if (method in provider) {
          store.dispatch(provider[method](action));
        } else {
          console.warn(`method: '${method}' is not supported by provider: '${provider.name}'`);
        }
      }).catch(err => {
        console.error('could not detect any virt provider');
      })
    }

    return next(action);
  }
}

export function dbus({ dispatch, getState }) {
  return next => action => {
    if (action.type === 'DBUS') {
      // TODO cache clients for the same name?
      const client = cockpit.dbus(action.name);

      const proxy = client.proxy(action.interface, action.path);

      const deferred = cockpit.defer();
      proxy.wait(() => {
        if (proxy.valid) {
          proxy[action.method].apply(null, action.args).done(deferred.resolve).fail(deferred.reject);
        } else {
          console.warn('dbus proxy not valid');
          // TODO dispatch error action?
          deferred.reject();
        }
      });

      return deferred.promise;
    }
    return next(action);
  }
}



