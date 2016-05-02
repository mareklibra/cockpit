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
  "base1/redux",
  "base1/cockpit",
  "vms/store",
  "vms/app"
], function(React, Redux, cockpit, store, App) {
  "use strict";

  console.log('index.js: state: ' + JSON.stringify(store.getState()));

  function render() {
    React.render(
      <App store={store}/>,
      document.getElementById('app'));
  }

  // re-render app every time the state changes
  store.subscribe(render);

  // do initial render
  render();
/*
 React.render(
 <Provider store={store}>
 <App/>
 </Provider>,
 document.getElementById('app'));

 */

});
