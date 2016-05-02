define([
  "base1/redux",
  "vms/reducers"
], function (Redux, reducer) {
  console.log("Creating new Redux store");
  const store = Redux.createStore(reducer);

  // configure store here

  console.log('store.jsx: state: ' + JSON.stringify(store.getState()));
  return store;
});
