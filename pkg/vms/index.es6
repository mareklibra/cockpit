import React from 'react';
//import Redux from 'base1/redux';
//import cockpit from 'cockpit';
//import store from 'vms/store';
//import App from 'vms/app';
//import {readHostVmsAction} from 'vms/actions';

console.log('TRADAAAAAAAA');
//console.log('index.es6: initial state: ' + JSON.stringify(store.getState()));
function render() {
  React.render(
  <h1>HELLO from React</h1>,
    document.getElementById('app'));
}
render();
/*
function render() {
  React.render(
    <App store={store} />,
    document.getElementById('app'));
}
*/
/*
// re-render app every time the state changes
store.subscribe(render);

// do initial render
render();

// initiate data retrieval
store.dispatch(readHostVmsAction());
*/