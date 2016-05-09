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

export default combineReducers({
  config,
  vms
});
