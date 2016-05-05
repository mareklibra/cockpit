/*
 * Provider for machined
 */

import { dbus, clearVms, addVm } from 'vms/actions';

export default {
  name: 'machined',

  GET_ALL_VMS ({ store }) {
    console.log(`${this.name}.GET_ALL_VMS():`);

    store.dispatch(dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'ListMachines'
    })).then(result => {
      console.log(`${this.name}.GET_ALL_VMS(): list of vms retrieved: ` + JSON.stringify(result));

      // assuming result is a list of VMS, TODO: verify
      store.dispatch(clearVms());

      // TODO: for each vm_name from the list, get detail
      // TODO: dispatch ADD_VM with subset of VM details which can be retrieved by the Machined provider
      store.dispatch(addVm({id: 'id1', name: 'name1', IPs: ['192.168.122.1']}));
    })

    return null; // no more processing, the action was splitted among others
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
