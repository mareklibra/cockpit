import {combineReducers} from 'base1/redux';
import cockpit from 'base1/cockpit';

// --- compatibility hack for IE
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
// -------------------------------

function config (state = {provider: null, refreshInterval: 10}, action) {
  switch (action.type) {
    case 'SET_PROVIDER':
      return Object.assign({}, state, {provider: action.provider});
    case 'SET_REFRESH_INTERVAL':
      return Object.assign({}, state, {provider: action.refreshInterval});
    default:
      return state;
  }
}

function vms (state = [], action) {
  console.log('reducer vms: action=' + JSON.stringify(action));
  let index;

  switch (action.type) {
    case 'CLEAR_VMS': // remove all VMs from the store
      return [];
    case 'UPDATE_ADD_VM':
      index = action.vm.id ? getFirstIndexOfVm(state, 'id', action.vm.id) : getFirstIndexOfVm(state, 'name', action.vm.name);
      if (index < 0) { // add
        return [...state, action.vm];
      }

      // update by merging
      const updatedVm = Object.assign({}, state[index], action.vm);
      return state.slice(0, index)
        .concat(updatedVm)
        .concat(state.slice(index+1));
    case 'DELETE_VM':
      index = action.id ? getFirstIndexOfVm(state, 'id', action.id) : getFirstIndexOfVm(state, 'name', action.name);
      return (index < 0) ? (state) :
        (state.slice(0, index).concat(state.slice(index+1)));
    default: // by default all reducers should return initial state on unknown actions
      return state;
  }
}

function getFirstIndexOfVm(state, field, value) {
  return state.findIndex(e => {
    return e[field] === value;
  });
}

export default combineReducers({
  config,
  vms
});
