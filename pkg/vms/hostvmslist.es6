import React, { PropTypes }  from "base1/react";
import { shutdownVm } from "vms/actions"

const { object, func } = PropTypes

function renderNoVm () {
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
)}

function renderVm (dispatch, vm) {
  return (
    <div className="list-group-item list-view-pf-stacked">
      <div className="list-view-pf-actions">
        <button className="btn btn-default">Action</button>
        <div className="dropdown pull-right dropdown-kebab-pf">
          <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span className="fa fa-ellipsis-v"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
              <li onClick={() => {dispatch(shutdownVm(vm.name))}}><a href="#"><img src="images/vm_shutdown.png"/> Shutdown</a></li>
          </ul>
        </div>
      </div>

      <div className="list-view-pf-main-info">
        <div className="list-view-pf-left">
          {vm.state}
        </div>

        <div className="list-view-pf-body">
          <div className="list-view-pf-description">
            <div className="list-group-item-heading">
              <a>{vm.name}</a>
              <small>id: {vm.id}</small>
              <small>IP: {vm.IPs}</small>
              <small>FQDN: {vm.fqdn}</small>
              <small>Up for: {vm.uptime} s</small>
            </div>
          </div>

          <div className="list-view-pf-additional-info">
            Additional info
          </div>
        </div>
      </div>
    </div>
)}

function HostVmsList({ vms, dispatch }) {
  var rows = [];
  if (Object.keys(vms).length === 0) {
    rows = renderNoVm();
  } else {
    Object.keys(vms).forEach(function (vmId) {
      rows.push(renderVm(dispatch, vms[vmId]));
    });
  }

  return (
    <div className = "container-fluid">
      <div className = "panel panel-default">
        <div className = "panel-heading">Running Virtual Machines</div>
        <div className = "list-group list-view-pf">
          {rows}
        </div>
      </div>
    </div>
  )
}

HostVmsList.propTypes = {
  vms: object.isRequired,
  dispatch: func.isRequired
}

export default HostVmsList
