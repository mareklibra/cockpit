/*
define([
  "react",
  "react-redux",
  "vms/actions",
  "vms/dashboard"
], function (React, { connect }, { myCustomAction }, Dashboard) {

  function App ({ dispatch }) {
    return (
      <div>
        <h1>Welcome to Cockpit VM managment</h1>
        <Dashboard />
        <button onClick={() => dispatch(myCustomAction('state changed'))}>Some custom action</button>
      </div>
    );
  }

  return connect()(App);

});
*/

define([
  "react",
  "base1/cockpit",
  "vms/dashboard",
  "vms/actions"
], function (React, cockpit, Dashboard, { myCustomAction }) {
//  "use strict";

  // App is a 'Smart' component - interacts with Redux store
  var appBody = React.createClass({
    render: function() {
      const { store } = this.props;
      const state = store.getState();
      return (
        <div>
          <h1>Welcome to New Cockpit VM Managment</h1>
          <Dashboard
            vms={state.vms}
            onCustomAction={() => store.dispatch(myCustomAction('state changed'))} />
        </div>
      );
    }
  });

  return appBody;

/*
  function App (dispatch) {
    return (
      <div>
        <h1>Welcome to New Cockpit VM managment</h1>
      </div>
    );
  }
//        <button onClick={() => dispatch(myCustomAction('state changed'))}>Some custom action</button>

 return connect()(App);
  */
});
