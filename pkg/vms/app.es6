import React, { PropTypes }  from "base1/react";
import cockpit from "base1/cockpit";
import HostVmsList from "vms/hostvmslist";
import store from "vms/store"

function App () {
  const state = store.getState();

  return (
    <div>
      <HostVmsList vms={state.vms}/>
    </div>
    );
}

export default App
