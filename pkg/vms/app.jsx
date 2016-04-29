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
  "base1/react-redux",// TODO: error: no 'redux' found
  "base1/cockpit"
], function (React, connect, cockpit) {
  "use strict";

  var appBody = React.createClass({
    render: function() {
      return (
        <div>
          <h1>Welcome to New Cockpit VM managment</h1>
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