import {combineReducers} from 'base1/redux';
import cockpit from 'base1/cockpit';

function config (state = {provider: null}, action) {
  switch (action.type) {
    case 'SET_PROVIDER':
      return Object.assign({}, state, {provider: action.provider});
    default:
      return state;
  }
}

function vms (state = [], action) {
  //state = state || {
  //    'example-vm-id-1' : {
  //      id: 'example-vm-id-1',
  //      name: 'Name of VM1',
  //      ips: ['192.168.1.2', '192.168.1.3'],
  //      fqdn: 'my.fqdn.com',
  //      uptime: 0
  //    },
  //    'example-vm-id-2' : {
  //      id: 'example-vm-id-2',
  //      name: 'Name of VM2',
  //      ips: ['192.168.1.4'],
  //      fqdn: 'my2.fqdn.com',
  //      uptime: 0
  //    }
  //  };

  console.log('reducer vms: action=' + JSON.stringify(action));

  switch (action.type) {
    case 'CLEAR_VMS': // remove all VMs from the store
      return {};
      // return action.vms; // replace current VM data with the ones provided by action
    case 'ADD_VM':
      var stateDiff = {};
      stateDiff[action.vm.id] = action.vm;
      return Object.assign({}, state, stateDiff);
    case 'DESTROY_VM':
      // TODO: remove the VM from store?
      return state;
    default: // by default all reducers should return initial state on unknown actions
      return state;
  }
}

//var readHostVms = function () {
//  var client = cockpit.dbus('org.freedesktop.machine1');
//  var proxy = client.proxy('org.freedesktop.machine1.Manager', '/org/freedesktop/machine1');
//  proxy.wait(function () {
//    if (proxy.valid) {
//      proxy.ListMachines().done(function (result) {
//        // result: [["qemu-2-mySecondVM","vm","libvirt-qemu","/org/freedesktop/machine1/machine/qemu_2d2_2dmySecondVM"]]
//        // machine name, machine class, an identifier for the service that registered the machine and the machine object path.
//        console.log('ListMachines() result: ' + JSON.stringify(result));
//
//        //var vmClient = cockpit.dbus('org.freedesktop.machine1');
//        var proxy2 = client.proxy('org.freedesktop.machine1.Machine', '/org/freedesktop/machine1/machine/qemu_2d2_2dmySecondVM');
//        proxy2.wait(function () {
//          if (proxy.valid) {
//            console.dir(proxy2);
//            /*              proxy2.GetMachine('qemu-2-mySecondVM').done(function (result) {
//             console.log('GetMachine() result: ' + JSON.stringify(result));
//             }).fail(function (ex) {
//             console.log('GetMachine() failed: ' + ex);// TODO
//             });*/
//          } else {
//            console.log('Proxy not valid!');
//          }
//        });
//        // TODO: dispatch actions
//      }).fail(function (ex) {
//        // TODO: handle ListMachines failure
//        console.log('ListMachines() failed: ' + ex);
//      });
//    }
//  });
//};

export default combineReducers({
  config,
  vms
});
