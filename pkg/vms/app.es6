import React, { PropTypes }  from "base1/react";
import cockpit from "base1/cockpit";
import HostVmsList from "vms/hostvmslist";

function App ({store}) {
  var state = store.getState();
  var dispatch = store.dispatch;

  return (
    <div>
      <HostVmsList vms={state.vms} dispatch={dispatch}/>
    </div>
    );
}

export default App
