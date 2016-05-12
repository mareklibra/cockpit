import cockpit from 'base1/cockpit';
import { setProvider, initProvider, getAllVms } from 'vms/actions';
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
export function spawn({ dispatch, getState }) {
  console.log('spawn-middleware');

  return next => action => {
    if (action.type === 'SPAWN') {
      console.log(`spawn-process-middleware: action: ${JSON.stringify(action)}`);

      const deferred = cockpit.defer();
      var stdout = '';

      if (action.script) { // call bash script
        const spawnArgs = [action.script];
        console.log(`spawn script args: ${spawnArgs}`);

        cockpit.script(spawnArgs)
//          .input(action.stdin)
          .stream(chunk => {
            stdout += chunk;
          })
          .done(() => {
            deferred.resolve(stdout)
          })
          .fail((ex, data) => {
            console.error(`spawn '${action.cmd}' script error: "${JSON.stringify(ex)}", data: "${JSON.stringify(data)}"`);
            deferred.reject({ex, data});
          });
      } else { // process
        const spawnArgs = [action.cmd, ...action.args];
        console.log(`spawn process args: ${spawnArgs}`);

        cockpit.spawn(spawnArgs)
          .input(action.stdin)
          .stream(chunk => {
            stdout += chunk;
          })
          .done(() => {
            deferred.resolve(stdout)
          })
          .fail((ex, data) => {
            console.error(`spawn '${action.cmd}' process error: "${JSON.stringify(ex)}", data: "${JSON.stringify(data)}"`);
            deferred.reject({ex, data});
          });
      }

      return deferred.promise;
    }
    return next(action);
  }
}
