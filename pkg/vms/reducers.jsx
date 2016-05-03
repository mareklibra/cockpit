define([
  "base1/redux",
  "base1/cockpit"
], function ({combineReducers}, cockpit) {
  function config (state, action) {
    state = state || {
        provider: null // vdsm, engine
      };
    // TODO: midleware swicth action type: check system capabilities
    return state;
  }

  function vms (state, action) {
    state = state || {
        'example-vm-id-1' : {
          id: 'example-vm-id-1',
          name: 'Name of VM1',
          ips: ['192.168.1.2', '192.168.1.3'],
          fqdn: 'my.fqdn.com',
          uptime: 0
        },
        'example-vm-id-2' : {
          id: 'example-vm-id-2',
          name: 'Name of VM2',
          ips: ['192.168.1.4'],
          fqdn: 'my2.fqdn.com',
          uptime: 0
        }
      };

    console.log('reducer vms: action=' + JSON.stringify(action));
    var newState = Object.assign({}, state);

    switch (action.type) {
      case 'ADD_VM':
        return newState;// TODO
      case 'REMOVE_VM':
        return newState;// TODO
      case 'READ_HOST_VMS':// TODO
        readHostVms();
        return state;// no state change, async action initiated
      case 'MY_CUSTOM_ACTION':
        newState[action.vmId].counter++;
        return newState;
      // by default all reducers should return initial state on unknown actions
      default:
        return state;
    }
  }

  var readHostVms = function () {
    var client = cockpit.dbus('org.freedesktop.machine1');
    var proxy = client.proxy('org.freedesktop.machine1.Manager', '/org/freedesktop/machine1');
    proxy.wait(function () {
      if (proxy.valid) {
        proxy.ListMachines().done(function (result) {
          // result: [["qemu-2-mySecondVM","vm","libvirt-qemu","/org/freedesktop/machine1/machine/qemu_2d2_2dmySecondVM"]]
          // machine name, machine class, an identifier for the service that registered the machine and the machine object path.
          console.log('ListMachines() result: ' + JSON.stringify(result));

          //var vmClient = cockpit.dbus('org.freedesktop.machine1');
          var proxy2 = client.proxy('org.freedesktop.machine1.Machine', '/org/freedesktop/machine1/machine/qemu_2d2_2dmySecondVM');
          proxy2.wait(function () {
            if (proxy.valid) {
                console.dir(proxy2);
/*              proxy2.GetMachine('qemu-2-mySecondVM').done(function (result) {
                console.log('GetMachine() result: ' + JSON.stringify(result));
              }).fail(function (ex) {
                console.log('GetMachine() failed: ' + ex);// TODO
              });*/
            } else {
              console.log('Proxy not valid!');
            }
          });
          // TODO: dispatch actions
        }).fail(function (ex) {
          // TODO: handle ListMachines failure
          console.log('ListMachines() failed: ' + ex);
        });
      }
    });
  };

  return combineReducers({
    config,
    vms
  });
});
