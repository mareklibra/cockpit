/**
 * All actions dispatchableby in the application
 */

// --- Provider actions -----------------------------------------
export function getAllVms () {
  return {
    type: 'VIRT',
    method: 'GET_ALL_VMS'
  };
}

export function getVmDetail (lookupId) {
  return {
    type: 'VIRT',
    method: 'GET_VM_DETAIL',
    lookupId // provider-specific (i.e. machined: dbus-path)
  };
}

export function shutdownVm (name) {
  return {
    type: 'VIRT',
    method: 'SHUTDOWN_VM',
    name
  }
}

export function initProvider (store) {
  return {
    type: 'VIRT',
    method: 'INITIALIZE',
    store
  }
}

// --- Store actions --------------------------------------------
export function setProvider (provider) {
  return {
    type: 'SET_PROVIDER',
    provider
  }
}

export function clearVms (vms) {
  return {
    type: 'CLEAR_VMS'
  }
}

export function addVm ({ id, name, IPs, state }) {
  var vm = {
    id,
    name,
    IPs,
    state
  };

  return {
    type: 'ADD_VM',
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
export function dbus ({ name, iface, path, method, args = [], signal}) {
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
