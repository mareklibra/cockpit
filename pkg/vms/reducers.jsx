define([
  "redux"
], function ({combineReducers}) {

  function vms (state, action) {
    state = state || 'Initial State';

    switch (action.type) {
      case 'MY_CUSTOM_ACTION':
        return action.param;
      // by default all reducers should return initial state on unknown actions
      default:
        return state;
    }
  }

  return combineReducers({
    vms
  });
});
