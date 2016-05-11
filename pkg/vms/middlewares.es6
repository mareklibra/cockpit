import cockpit from 'base1/cockpit';
import { setProvider, initProvider } from 'vms/actions';
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

    let provider = null;
    if (false /*TODO: Detect VDSM*/) {
      // TODO: dispatch/resolve VDSM provider
    } else if (true /* TODO: detect machined */) {
      console.log('Selecting Machined as the VIRT provider.');
      provider = Machined;
    }

    if (!provider) { //  no provider available
      deferred.reject();
    } else {
      // First we set the provider to the `config` part of the store,
      store.dispatch(setProvider(provider));
      // and then we dispatch special 'VIRT' method to initialize it.
      // Since the provider will have already been set in config,
      // the virt middleware will correctly dispatch this action.
      // Providers are expected to return promise as a part of initialization
      // so we can resolve only after the provider had time to properly initialize.
      store
        .dispatch(initProvider(store))
        .then(() => deferred.resolve(provider))
        .catch(deferred.reject);
    }

    return deferred.promise;
  }
}

/**
 * Middleware handling actions of type 'VIRT'.
 *
 * Dispatches VIRT methods based on currently set virt provider. In case no provider is set yet,
 * it performs discovery and chooses the best available provider (Machined, VDSM, ...).
 *
 * In case it handles a 'VIRT' action it returns promise that resolves to the result of dispatching value
 * obtained from invoking the provider method.
 *
 * This combined with provider methods resulting in promise objects (e.g. in conjunction with the
 * {@link dbus} middleware) enables chained calls like the following:
 *
 * <pre><code>
 *   store.dispatch({
 *     type: 'VIRT',
 *     method: 'SHUTDOWN_VM',
 *     name: 'vm1'
 *   }).then(() => alert('VM successfully shut down!'))
 * </code></pre>
 *
 * Thus treating the entire provider method invocation like a promise.
 */
export function virt(store) {
  console.log('virt-middleware');
  return next => action => {
    if (action.type === 'VIRT') {
      return getVirtProvider(store).then(provider => {
        const method = action.method;
        if (method in provider) {
          console.log(`virt-middleware: Calling ${provider.name}.${method}(${JSON.stringify(action)})`);
          return store.dispatch(provider[method](action));
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

const dbusClients = {};

export function dbus({ dispatch, getState }) {
  console.log('dbus-middleware');

  return next => action => {
    if (action.type === 'DBUS') {
      console.log(`dbus-middleware: action: ${action.name}, interface: ${action.iface}, path: ${action.path}, method: ${action.ownProperties}, args: ${action.args}`);

      var client = dbusClients[action.name];
      if (!client) { // cache dbus clients of the same name
        client = cockpit.dbus(action.name);
        dbusClients[action.name] = client;
      }

      const proxy = client.proxy(action.iface, action.path);
      const deferred = cockpit.defer();
      proxy.wait(() => {
        if (proxy.valid) {
          if (action.method) { // method call
            proxy[action.method]
              .apply(null, action.args)
              .done(deferred.resolve)
              .fail(reason => {
                console.log('DBus method call failed: ' + reason);
                deferred.reject(reason);
              });
          } else if (action.signal) { // register signal handler
            proxy.addEventListener('signal', action.signal);
            deferred.resolve();
          } else { // get object properties only
            deferred.resolve(proxy.data);
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
