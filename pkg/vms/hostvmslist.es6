import React, { PropTypes } from "base1/react";
import { shutdownVm, forceVmOff, forceRebootVm, rebootVm, startVm, navigate } from "vms/actions";

const { object, func } = PropTypes;

function NoVm () {
  return (
    <div className="cockpit-log-warning">
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <i className="fa fa-rocket"></i>
        </div>
        <span>
          <h1>No VM is running on this host</h1>
          <p>Let's keep hoping in a change or start a new one ...</p>
        </span>
      </div>
    </div>
  )
}

// TODO: add tooltips to symbols
function getStateIcon (state, onStart) {
  switch (state) {
    case 'running':// TODO: display VM screenshot if available or the ok-icon otherwise
      return (<i className="pficon pficon-ok icon-2x"> </i>);
    case 'idle':
      return (<i className="pficon  pficon-running icon-2x"> </i>);
    case 'paused':
      return (<i className="glyphicon glyphicon-pause icon-2x"> </i>);
    case 'shutdown':
      return (<i className="glyphicon glyphicon-wrench icon-2x"> </i>);
    case 'shut off':
      return (<a> <i className="pficon-add-circle-o icon-2x" onClick={onStart}> </i></a>);
    case 'crashed':
      return (<i className="pficon  pficon-error-circle-o icon-2x"> </i>);
    case 'dying':
      return (<i className="pficon  pficon-warning-triangle-o icon-2x"> </i>);
    case 'pmsuspended':
      return (<i className="pficon pficon-ok icon-2x"> </i>); // TODO: paused due to powermanagement
    case undefined:
      return (<div />);
    default:
      return (<small>{state}</small>);
  }
}

function Vm ({ vm, onVmClick, onShutdown, onForceoff, onReboot, onForceReboot, onStart }) {
  const stateIcon = getStateIcon(vm.state, onStart);

  return (
    <div className="list-group-item list-view-pf-stacked">
      <div className="list-view-pf-actions">
        <button className="btn btn-default">Action</button>
        <div className="dropdown pull-right dropdown-kebab-pf">
          <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span className="fa fa-ellipsis-v"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
              <li onClick={onReboot}><a href="#"><i className="fa fa-refresh"/> Reboot</a></li>
              <li onClick={onForceReboot}><a href="#"><i className="fa fa-refresh"/> Force Reboot</a></li>
              <li onClick={onShutdown}><a href="#"><i className="fa fa-power-off"/> Shutdown</a></li>
              <li onClick={onForceoff}><a href="#"><i className="fa fa-power-off"/> Force Off</a></li>
          </ul>
        </div>
      </div>

      <div className="list-view-pf-main-info">
        <div className="list-view-pf-left">
          {stateIcon}
        </div>

        <div className="list-view-pf-body">
          <div className="list-view-pf-description">
            <div className="list-group-item-heading">
              <a onClick={onVmClick}>{vm.name}</a>
              <small>id: {vm.id}</small>
              <small>OS: {vm.osType}</small>
              <small>Memory: {vm.currentMemory}</small>
              <small>CPUs: {vm.vcpus}</small>
              <small>Autostart: {vm.autostart}</small>
            </div>
          </div>

          <div className="list-view-pf-additional-info">
            TBD: Usage Charts

          </div>
        </div>
      </div>
    </div>
)}

function HostVmsList({ vms, dispatch }) {
  let rows = [];
  if (vms.length === 0) {
    rows = <NoVm />;
  } else {
    rows = vms.map(vm => (
      <Vm vm={vm}
        onVmClick={() => dispatch(navigate(['vm', vm.name], true))}
        onReboot={() => dispatch(rebootVm(vm.name))}
        onForceReboot={() => dispatch(forceRebootVm(vm.name))}
        onShutdown={() => dispatch(shutdownVm(vm.name))}
        onForceoff={() => dispatch(forceVmOff(vm.name))}
        onStart={() => dispatch(startVm(vm.name))}/>
    ));
  }

  return (
    <div className="container-fluid">
      <div className="panel panel-default">
        <div className="panel-heading">Running Virtual Machines</div>
        <div className="list-group list-view-pf">
          {rows}
        </div>
      </div>
    </div>
  )
}

HostVmsList.propTypes = {
  vms: object.isRequired,
  dispatch: func.isRequired
};

export default HostVmsList
