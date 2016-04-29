/*define([
  "base1/redux",
  "vms/reducers"
], function (createStore, reducer) {

  const store = createStore(reducer);

  // configure store here

  return store;
});
*/

define([
  "redux",
  "vms/reducers"
], function (RR, reducer) {

  const store = RR.createStore(reducer);

  // configure store here

  return store;
});
