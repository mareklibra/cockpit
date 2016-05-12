import { compose, applyMiddleware, createStore } from 'base1/redux';
import reducer from 'vms/reducers';
import { thunk /*, dbus */ } from 'vms/middlewares';

const createStoreWithMiddleware = applyMiddleware(
  thunk
  /*, dbus */
)(createStore);

const store = createStoreWithMiddleware(reducer);

console.log('store.jsx: state: ' + JSON.stringify(store.getState()));

export default store;
