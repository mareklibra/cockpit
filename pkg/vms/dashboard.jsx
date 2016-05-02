/*
define([
  "react",
  "base1/react-redux"
], function (React, { connect }) {

  function Dashboard ({ stuff }) {
    return (
      <div>
        <h2>Fancy Dashboard</h2>
        {stuff}
      </div>
    );
  }

  return connect(state => ({
    stuff: state.vms
  }))(Dashboard);
});
*/
define([
  "react"
], function (React) {
  "use strict";

  // Dashboard is a 'dumb' component - only pure presentational logic
  var body = React.createClass({
    render: function() {
      const { vms, onCustomAction } = this.props;
      return (
        <div>
          <h2>My Fancy Dashboard</h2>
          <button onClick={onCustomAction}>Some custom action</button>
        </div>
      );
    }
  });

  return body;
});
