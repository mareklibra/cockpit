import { compose, applyMiddleware, createStore } from 'base1/redux';
import reducer from 'vms/reducers';
import { thunk, virt, dbus } from 'middleware';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(virt),
  applyMiddleware(dbus)
)(createStore);

const store = createStoreWithMiddleware(reducer);

console.log('store.jsx: state: ' + JSON.stringify(store.getState()));

export default store;
