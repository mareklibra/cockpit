define([
  "base1/react",
  "base1/cockpit",
  "vms/hostvmslist"
], function (React, cockpit, HostVmsList) {
  // App is a 'Smart' component - interacts with Redux store
  var appBody = React.createClass({
    render: function() {
      const { store } = this.props;
      const state = store.getState();
      return (
        <div>
          <HostVmsList vms={state.vms}/>
        </div>
      );
    }
  });

  return appBody;
});
