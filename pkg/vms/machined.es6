/*
 * Provider for machined
 */

import { dbus, clearVms, addVm } from 'vms/actions';

export default {
  name: 'machined',

  GET_ALL_VMS () {
    return dispatch => {
      dispatch(dbus({
        name: 'org.freedesktop.machine1',
        iface: 'org.freedesktop.machine1.Manager',
        path: '/org/freedesktop/machine1',
        method: 'ListMachines'
      })).then(result => {
        // assuming result is a list of VMS, TODO: verify
        dispatch(clearVms());

        // TODO: for each vm_name from the list, get detail
        // TODO: dispatch ADD_VM with subset of VM details which can be retrieved by the Machined provider
        dispatch(addVm({id:'id1', name: 'name1', IPs: ['192.168.122.1']}));
      })
    }
  },

  DESTROY_VM ({ name }) {
    return dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'TerminateMachine',
      args: [name]
    })
  }
};
