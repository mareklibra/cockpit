/**
 * All actions dispatchableby in the application
 */

// --- Provider actions -----------------------------------------
export function readHostVmsAction () {
  return {
    type: 'VIRT',
    method: 'GET_ALL_VMS'
  };
}

export function destroyVm(name) {
  return {
    type: 'VIRT',
    method: 'DESTROY_VM',
    name
  }
}

// --- Store actions --------------------------------------------
export function setProvider(provider) {
  return {
    type: 'SET_PROVIDER',
    provider
  }
}

export function clearVms(vms) {
  return {
    type: 'CLEAR_VMS'
  }
}

export function addVm({ id, name, IPs, state }) {
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

// --- DBus actions ---------------------------------------------
export function dbus ({ name, iface, path, method = 'ownProperties', args = []}) {
  return {
    type: 'DBUS',
    name,
    iface,
    path,
    method,
    args
  }
}
