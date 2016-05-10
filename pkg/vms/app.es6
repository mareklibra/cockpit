import React, { PropTypes } from "base1/react";
import cockpit from "base1/cockpit";
import HostVmsList from "vms/hostvmslist";

function App ({ store }) {
  const { vms } = store.getState();
  const dispatch = store.dispatch;

  return (
    <div>
      <HostVmsList vms={vms} dispatch={dispatch}/>
    </div>
  );
}

export default App
