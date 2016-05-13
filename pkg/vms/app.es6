import React, { PropTypes } from "base1/react";
import cockpit from "base1/cockpit";
import HostVmsList from "vms/hostvmslist";
import VmDetail from "vms/vmdetail";
import { navigate } from "vms/actions";
import { arrayEquals } from "vms/helpers";

function route (navigation, dispatch, vms) {
  const path = navigation.path;
  console.log(`Routing location path: ${path}`);

  let mainComponent = (<HostVmsList vms={vms} dispatch={dispatch}/>);
  if (path[0] === 'vm') { // URL: .../vms#/vm
    const vm = getVm(vms, path[1]);
    if (vm) {
      mainComponent = (<VmDetail vm={vm} />);
    } else {
      console.error(`Unknwon VM requested: ${path[1]}`);
    }
  } else if (path[0] == 'something else') { // URL: .../vms/#/...
  }

  return mainComponent;
}

function App ({ store }) {
  const { vms, navigation } = store.getState();
  const dispatch = store.dispatch;

  if (!arrayEquals(navigation.path, cockpit.location.path)) {
    dispatch(navigate(cockpit.location.path));
  }

  return (
    <div>
      {route(navigation, dispatch, vms)}
    </div>
  );
}

function getVm (vms, name) {
  return vms.filter( v => {return v.name === name})[0];
}

export default App
