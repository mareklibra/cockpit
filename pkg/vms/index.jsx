require([
  "react",
  "base1/redux",
  "base1/cockpit",
  "vms/store",
  "vms/app",
  "vms/actions"
], function(React, Redux, cockpit, store, App, {readHostVmsAction}) {

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

  // initiate data retrieval
  store.dispatch(readHostVmsAction());
});
