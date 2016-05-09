import React from 'base1/react';
import Redux from 'base1/redux';
import cockpit from 'base1/cockpit';
import store from 'vms/store';
import App from 'vms/app';
import {initProvider, getAllVms} from 'vms/actions';

console.log('index.es6: initial state: ' + JSON.stringify(store.getState()));

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
store.dispatch(initProvider(store));
store.dispatch(getAllVms());
