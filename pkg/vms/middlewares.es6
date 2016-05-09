import cockpit from 'base1/cockpit';
import { setProvider } from 'vms/actions';
import Machined from 'vms/machined';

export function thunk({ dispatch, getState }) {
  console.log('thunk-middleware');

  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
}

function getVirtProvider(store) {
  const state = store.getState();
  if (state.config.provider) {
    return cockpit.resolve(state.config.provider);
  } else {
    const deferred = cockpit.defer();
    console.log('Discovering provider');
    // TODO: discover host capabilities by dispatching dbus() actions

    if (false /*TODO: Detect VDSM*/) {
      // TODO: dispatch/resolve VDSM provider
    } else if (true /* TODO: detect machined */) {
      console.log('store.dispatch(setProvider(Machined))');
      store.dispatch(setProvider(Machined));
      deferred.resolve(Machined);
    } else { //  no provider available
      // TODO: throw exception
    }
    return deferred.promise;
  }
}

export function virt(store) {
  console.log('virt-middleware');
  return next => action => {
    if (action.type === 'VIRT') {
      getVirtProvider(store).then(provider => {
        const method = action.method;
        if (method in provider) {
          console.log(`virt-middleware: Calling ${provider.name}.${method} with action: ` + JSON.stringify(action));
          var nextAction = provider[method](action)
          if (nextAction) {
            console.log(`virt-middleware: nextAction to dispatch: ` + JSON.stringify(nextAction));
            store.dispatch(nextAction);
          }
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

const wait_valid = (proxy, callback) => {
  proxy.wait(function () {
    if (proxy.valid) {
      callback();
    }
  });
}
export function dbus({ dispatch, getState }) {
  console.log('dbus-middleware');

  return next => action => {
    if (action.type === 'DBUS') {
      // TODO cache clients for the same name?
      console.log(`dbus-middleware: action: ${action.name}, interface: ${action.iface}, path: ${action.path}, method: ${action.ownProperties}, args: ${action.args}`);
      const client = cockpit.dbus(action.name);
      const proxy = client.proxy(action.iface, action.path);

      const deferred = cockpit.defer();
      proxy.wait(() => {
        if (proxy.valid) {
          if (action.method === 'ownProperties') { // get object proprties only
            deferred.resolve(proxy.data);
          } else { // method call
            proxy[action.method]
              .apply(null, action.args)
              .done(deferred.resolve)
              .fail(reason => {
                console.log('DBus call method failed: ' + reason);
                deferred.reject();
              });
          }
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



