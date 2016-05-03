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

export function setProvider(provider) {
  return {
    type: 'SET_PROVIDER',
    provider
  }
}

export function setVms(vms) {
  return {
    type: 'SET_VMS',
    vms
  }
}

export function dbus ({ name, iface, path, method, args = []}) {
  return {
    type: 'DBUS',
    name,
    iface,
    path,
    method,
    args
  }
}

export function myCustomAction (vmId) {
  return {
    type: 'MY_CUSTOM_ACTION',
    vmId: vmId
  };
}
