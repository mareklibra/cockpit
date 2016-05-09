/*
 * Provider for machined
 */
import cockpit from 'base1/cockpit';
import { dbus, clearVms, addVm } from 'vms/actions';

export default {
  name: 'machined',

  GET_ALL_VMS ({ store }) {
    console.log(`${this.name}.GET_ALL_VMS():`);

    store.dispatch(dbus({ // call method
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'ListMachines'
    })).then(result => {
      console.log(`${this.name}.GET_ALL_VMS(): list of vms retrieved: ` + JSON.stringify(result));

      store.dispatch(clearVms());

      // store.dispatch(addVm({id: 'id1', name: 'testMachineName', IPs: ['192.168.122.1']}));

      result.forEach(vm => {
        console.log('ListMachines: vm = ' + JSON.stringify(vm));
        var clazz = vm[1]; // like 'vm'
        var path = vm[3]; // like '/org/freedesktop/machine1/machine/fedora_2dtree'

        if (clazz === 'vm') {
          // get VM details
          store.dispatch(dbus({ // get Machine properties
            name: 'org.freedesktop.machine1',
            iface: 'org.freedesktop.machine1.Machine',
            path
          })).then(vmDetail => {
            console.log('VM Detail: ' + JSON.stringify(vmDetail));
            var id = vmDetail['Id'];
            var name = vmDetail['Name'];
            var state = vmDetail['State'];

            // TODO: read addresses and OS
            store.dispatch(addVm({id, name, IPs: undefined, state}));
          });
        } // skip others

/*        const client = cockpit.dbus('org.freedesktop.machine1');
        const proxy = client.proxy('org.freedesktop.machine1.Machine', '/org/freedesktop/machine1/machine/qemu_2d2_2dmySecondVM');
        proxy.wait(() => {
          if (proxy.valid) {
            console.log('proxy: ' + JSON.stringify(proxy));
          } else {
            console.log('VM proxy not valid');
          }
        });
*/
      });
    });

    // stop action processing, the action was splitted among others
    return null;
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
