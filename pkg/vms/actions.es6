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

export function scheduleDelayedAction (delayedAction) {
  return {
    type: 'DELAY_ACTION',
    delayedAction
  }
}

export function getVm (lookupId) {
  return {
    type: 'VIRT',
    method: 'GET_VM',
    lookupId // provider-specific (i.e. libvirt uses vm_name)
  };
}

export function shutdownVm (name) {
  return {
    type: 'VIRT',
    method: 'SHUTDOWN_VM',
    name
  }
}

export function initProvider () {
  return {
    type: 'VIRT',
    method: 'INIT'
  }
}

// --- Store actions --------------------------------------------
export function setProvider (provider) {
  return {
    type: 'SET_PROVIDER',
    provider
  }
}

// TODO: call it
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
// --- Spawn actions --------------------------------------------
export function spawnProcess ({ cmd, args = [], stdin}) {
  return {
    type: 'SPAWN',
    cmd,
    args,
    stdin
  }
}

export function spawnScript ({ script }) {
  return {
    type: 'SPAWN',
    script
  }
}