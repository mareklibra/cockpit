/*
 * Provider for machined
 */
import cockpit from 'base1/cockpit';
import { dbus, clearVms, addVm, deleteVm, getVmDetail } from 'vms/actions';

export default {
  SHUTDOWN_VM ({ name }) {
    return dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'TerminateMachine',
      args: [name]
    })
  },

  name: 'machined',
  store: null,

  INITIALIZE ({store}) {
    console.log(`${this.name}.INIT()`);
    this.store = store;

    store.dispatch(dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      signal: true,
      handler: (event, name, args) => {
        switch (name) {
          case 'MachineNew':
            console.log('New machine detected: ' + JSON.stringify({event, name, args}));
            var path = args[1]; // /org/freedesktop/machine1/machine/qemu_2d6_2dmySecondVM
            store.dispatch(getVmDetail(path));
            break;
          case 'MachineRemoved':
            console.log('Machine removed: ' + JSON.stringify({event, name, args}));
            store.dispatch(deleteVm({name: args[0]}));
            break;
          default:
            console.error(`machined.INIT(): unhandled signal ${name}`);
        }
      }}));

    return null; // stop processing
  },

  GET_VM_DETAIL ({lookupId}) {
    var path = lookupId;
    var store = this.store;

    store.dispatch(dbus({ // get dbus Machine properties
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Machine',
      path
    })).then(vmDetail => {
      console.log('VM Detail retrieved: ' + JSON.stringify(vmDetail));
      var id = vmDetail['Id'];
      var name = vmDetail['Name'];
      var state = vmDetail['State'];

      // TODO: compute uptime
      // TODO: read addresses and OS
      store.dispatch(addVm({id, name, IPs: undefined, state}));
    });

    return null; // stop processing
  },

  GET_ALL_VMS () {
    console.log(`${this.name}.GET_ALL_VMS():`);
    var store = this.store;

    store.dispatch(dbus({ // call dbus method
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'ListMachines'
    })).then(result => {
      console.log(`${this.name}.GET_ALL_VMS(): list of vms retrieved: ` + JSON.stringify(result));
      store.dispatch(clearVms());
      // store.dispatch(addVm({id: 'id1', name: 'testMachineName', IPs: ['192.168.122.1']}));

      result.forEach(vm => {
        var clazz = vm[1]; // like 'vm'
        var path = vm[3]; // like '/org/freedesktop/machine1/machine/fedora_2dtree'

        if (clazz === 'vm') { // get VM details
          store.dispatch(getVmDetail(path));
        } // skip others
      });
    });

    // stop action processing, the action was splitted among others
    return null;
  }
};
