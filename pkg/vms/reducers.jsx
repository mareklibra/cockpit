define([
  "base1/redux"
], function ({combineReducers}) {

  function vms (state, action) {
    state = state || {
        'example-vm-id-1' : {
          id: 'example-vm-id-1',
          name: 'Name of VM1'
        },
        'example-vm-id-2' : {
          id: 'example-vm-id-2',
          name: 'Name of VM2'
        }
      };

    switch (action.type) {
      case 'ADD_VM':
        return state;// TODO
      case 'REMOVE_VM':
        return state;// TODO
      // by default all reducers should return initial state on unknown actions
      default:
        return state;
    }
  }

  return combineReducers({
    vms
  });
});
