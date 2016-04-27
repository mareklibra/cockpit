define([
  "../../base1/redux",
  "vms/reducers"
], function ({ createStore }, reducer) {

  const store = createStore(reducer);

  // configure store here

  return store;
});
