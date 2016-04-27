define([
  "../../base1/react",
  "../../base1/react-redux",
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
