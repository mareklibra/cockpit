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
