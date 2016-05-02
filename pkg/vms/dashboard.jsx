// THIS COMPONENT IS NOT USED.
// For testing only

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
          {JSON.stringify(vms)}
        </div>
      );
    }
  });

  return body;
});
