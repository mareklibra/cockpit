import cockpit from 'base1/cockpit';
import Libvirt from 'vms/libvirt';
import { getRefreshInterval } from 'vms/selectors';

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

export function forceVmOff (name) {
  return virt('FORCEOFF_VM', { name });
}

export function rebootVm (name) {
  return virt('REBOOT_VM', { name });
}

export function forceRebootVm (name) {
  return virt('FORCEREBOOT_VM', { name });
}

export function startVm (name) {
  return virt('START_VM', { name });
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
    /* TODO: discover host capabilities
     systemctl is-active vdsmd
       active
       unknown
     */
    let provider = null;
    if (false /*TODO: Detect VDSM*/) {
      // TODO: dispatch/resolve VDSM provider
    } else if (true /* TODO: detect libvirt */) {
      console.log('Selecting Libvirt as the VIRT provider.');
      provider = Libvirt;
    }

    if (!provider) { //  no provider available
      deferred.reject();
    } else {
      store.dispatch(setProvider(provider));

      // Skip the initialization if provider does not define the `init` hook.
      if (!provider.init) {
        deferred.resolve(provider);
      } else {
        // Providers are expected to return promise as a part of initialization
        // so we can resolve only after the provider had time to properly initialize.
        store
          .dispatch(provider.init())
          .then(() => deferred.resolve(provider))
          .catch(deferred.reject);
      }
    }

    return deferred.promise;
  }
}

/**
 * Helper for delaying the execution of requested action
 */
export function delay (action, timeout) {
  return (dispatch, getState) => {
    timeout = timeout || getRefreshInterval(getState());
    console.log(`Scheduling ${timeout} ms delayed action`);
    window.setTimeout(() => dispatch(action), timeout);
  }
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

export function updateOrAddVm ({ id, name, state, osType, fqdn, uptime, currentMemory, vcpus, autostart }) {
  let vm = {};
  if (id !== undefined) vm.id = id;
  if (name !== undefined) vm.name = name;
  if (state !== undefined) vm.state = state;
  if (osType !== undefined) vm.osType = osType;
  if (currentMemory !== undefined) vm.currentMemory = currentMemory;
  if (vcpus !== undefined) vm.vcpus = vcpus;
  if (fqdn !== undefined) vm.fqdn = fqdn;
  if (uptime !== undefined) vm.uptime = uptime;
  if (autostart !== undefined) vm.autostart = autostart;

  return {
    type: 'UPDATE_ADD_VM',
    vm
  }
}

export function deleteUnlistedVMs(vmNames) {
  return {
    type: 'DELETE_UNLISTED_VMS',
    vmNames
  }
}

export function deleteVm({ id, name }) { // either id or name must be specified
  return {
    type: 'DELETE_VM',
    id,
    name
  }
}

// --- Navigation -----------------------------------------------
export function navigate (path, replaceUrl) {
  if (replaceUrl) {
    cockpit.location.replace(path); // initiated internally, no need to call cockpit.location.go
  }

  return {
    type: 'NAVIGATE',
    path
  }
}
