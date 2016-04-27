/*
require([
  "../../base1/react",
  "../../base1/redux",
  "vms/store",
  "vms/app"
], function (React, { Provider }, store, App) {

  React.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'));

});
*/


define([
  "react",
  "redux"
], function (React, { Provider } ) {

  React.render(
    <h1>Hello</h1>,
    document.getElementById('app'));

});
