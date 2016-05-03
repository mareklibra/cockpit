define([
  "base1/redux",
  "vms/reducers"
], function (Redux, reducer) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    applyMiddleware(virt),
    applyMiddleware(machined)
  )(Redux.createStore);

  const store = createStoreWithMiddleware(reducer);

  console.log('store.jsx: state: ' + JSON.stringify(store.getState()));
  return store;
});
