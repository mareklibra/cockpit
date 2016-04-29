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

require([
  "react",
  "redux",
  "base1/cockpit",
  "vms/store",
  "vms/app"
], function(React, Provider, cockpit, store, App) {
  "use strict";

  React.render(
      <App/>,
    document.getElementById('app'));
/*
 React.render(
 <Provider store={store}>
 <App/>
 </Provider>,
 document.getElementById('app'));

 */

});
