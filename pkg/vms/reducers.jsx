define([
  "base1/redux"
], function ({combineReducers}) {

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

  return combineReducers({
    vms
  });

  var readHostVms = function () {
    var client = cockpit.dbus('org.freedesktop.machine1')
    var proxy = client.proxy('org.freedesktop.machine1.Manager', '/org/freedesktop/machine1');
    proxy.wait(function () {
      if (proxy.valid) {
        proxy.ListMachines().done(function (result) {
          console.log('readHostVms() result: ' + JSON.stringify(result));
          // TODO: dispatch actions
        })
      }
    });

  }
});
