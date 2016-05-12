import cockpit from 'base1/cockpit';
import Machined from 'vms/machined';

/**
 * All actions dispatchableby in the application
 */

// --- Provider actions -----------------------------------------
export function getAllVms () {
  return virt('GET_ALL_VMS');
}

export function getVm (lookupId) {
  return virt('GET_VM', { lookupId }); // provider-specific (i.e. libvirt uses vm_name)
}

export function shutdownVm (name) {
  return virt('SHUTDOWN_VM', { name });
}

export function initProvider () {
  return virt('INIT');
}

/**
 * Helper for dispatching virt provider methods.
 *
 * Lazily initializes the virt provider and dispatches given method on it.
 */
function virt (method, action) {
  return (dispatch, getState) => getVirtProvider({ dispatch, getState }).then(provider => {
    if (method in provider) {
      console.log(`Calling ${provider.name}.${method}(${JSON.stringify(action)})`);
      return dispatch(provider[method](action));
    } else {
      console.warn(`method: '${method}' is not supported by provider: '${provider.name}'`);
    }
  }).catch(err => {
    console.error('could not detect any virt provider');
  })
}

function getVirtProvider(store) {
  const state = store.getState();
  if (state.config.provider) {
    return cockpit.resolve(state.config.provider);
  } else {
    const deferred = cockpit.defer();
    console.log('Discovering provider');
    // TODO: discover host capabilities

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
        .dispatch(initProvider())
        .then(() => deferred.resolve(provider))
        .catch(deferred.reject);
    }

    return deferred.promise;
  }
}

/**
 * Helper for delaying the execution of requested action
 */
export function delay (action, timeout = 3000) {
  console.log(`Scheduling ${timeout} ms delayed action: ${action}`);
  return dispatch => window.setTimeout(() => dispatch(action), timeout);
}

// --- Store actions --------------------------------------------
export function setProvider (provider) {
  return {
    type: 'SET_PROVIDER',
    provider
  }
}

// TODO: call it from UI
export function setRefreshInterval (refreshInterval) {
  return {
    type: 'SET_REFRESH_INTERVAL',
    refreshInterval
  }
}

export function clearVms (vms) {
  return {
    type: 'CLEAR_VMS'
  }
}

export function updateOrAddVm ({ id, name, state, osType, fqdn, uptime, currentMemory }) {
  let vm = {};
  if (id !== undefined) vm.id = id;
  if (name !== undefined) vm.name = name;
  if (state !== undefined) vm.state = state;
  if (osType !== undefined) vm.osType = osType;
  if (currentMemory !== undefined) vm.currentMemory = currentMemory;
  if (fqdn !== undefined) vm.fqdn = fqdn;
  if (uptime !== undefined) vm.uptime = uptime;

  return {
    type: 'UPDATE_ADD_VM',
    vm
  }
}


export function deleteVm({id, name}) { // either id or name must be specified
  return {
    type: 'DELETE_VM',
    id,
    name
  }
}

// --- DBus actions ---------------------------------------------
/*export function dbus ({ name, iface, path, method, args = [], signal}) {
  return {
    type: 'DBUS',
    name,
    iface,
    path,
    method,
    args,
    signal
  }
}
*/
