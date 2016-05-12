import { setProvider, initProvider, getAllVms } from 'vms/actions';

export function thunk({ dispatch, getState }) {
  console.log('thunk-middleware');

  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
}

/*
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
*/