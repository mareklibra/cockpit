/*
 * Provider for machined
 */
import cockpit from 'base1/cockpit';
import { dbus, clearVms, addVm, deleteVm, getVmDetail } from 'vms/actions';

export default {
  name: 'machined',

  INITIALIZE () {
    console.log(`${this.name}.INIT()`);

    return dispatch => dispatch(dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      signal (event, name, args) {
        switch (name) {
          case 'MachineNew':
            console.log('New machine detected: ' + JSON.stringify({ event, name, args }));
            const path = args[1]; // /org/freedesktop/machine1/machine/qemu_2d6_2dmySecondVM
            dispatch(getVmDetail(path));
            break;
          case 'MachineRemoved':
            console.log('Machine removed: ' + JSON.stringify({ event, name, args }));
            dispatch(deleteVm({ name: args[0] }));
            break;
          default:
            console.error(`machined.INIT(): unhandled signal ${name}`);
        }
      }}));
  },

  GET_VM_DETAIL ({ lookupId: path }) {
    return dispatch => dispatch(dbus({ // get dbus Machine properties
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Machine',
      path
    })).then(vmDetail => {
      console.log('VM Detail retrieved: ' + JSON.stringify(vmDetail));
      const { Id: id, Name: name, State: state } = vmDetail;
      // TODO: compute uptime
      // TODO: read addresses and OS
      dispatch(addVm({ id, name, state }));
    });
  },

  GET_ALL_VMS () {
    console.log(`${this.name}.GET_ALL_VMS():`);

    return dispatch => {
      dispatch(dbus({ // call dbus method
        name: 'org.freedesktop.machine1',
        iface: 'org.freedesktop.machine1.Manager',
        path: '/org/freedesktop/machine1',
        method: 'ListMachines'
      })).then(result => {
        console.log(`${this.name}.GET_ALL_VMS(): list of vms retrieved: ` + JSON.stringify(result));
        dispatch(clearVms());

        // path like '/org/freedesktop/machine1/machine/fedora_2dtree'
        result
          .map(vm => ({ clazz: vm[1], path: vm[3] }))
          .filter(({ clazz }) => clazz === 'vm')
          .forEach(({ path }) => dispatch(getVmDetail(path)))
      });
    };
  },

  SHUTDOWN_VM ({ name }) {
    return dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'TerminateMachine',
      args: [name]
    })
  }

};
