define([
  "react"
], function (React) {
  "use strict";

  var renderNoVm = function () {
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
    );
  };

  var renderVm = function (vm) {
    return (
      <div className="list-group-item list-view-pf-stacked">
        <div className="list-view-pf-main-info">
          <div className="list-view-pf-left">
            StatusIcon
          </div>

          <div className="list-view-pf-body">
            <div className="list-view-pf-description">
              <div className="list-group-item-heading">
                <a>{vm.name}</a>
                <small>{vm.ips}</small>
                <small>{vm.fqdn}</small>
                <small>Up for: {vm.uptime} s</small>
              </div>
            </div>

            <div className="list-view-pf-additional-info">
              Additional info
            </div>

          </div>
        </div>
      </div>
    );
  };

  var body = React.createClass({
    render: function () {
      const { vms } = this.props;

      var rows = [];
      if (Object.keys(vms).length === 0) {
        rows = renderNoVm();
      } else {
        Object.keys(vms).forEach(function (vmId) {
          rows.push(renderVm(vms[vmId]));
        });
      }

      return (
        <div className="container-fluid">
          <div className="panel panel-default">
            <div className="panel-heading">Running Virtual Machines</div>
            <div className="list-group list-view-pf"></div>
            {rows}
          </div>
        </div>
      );
    }
  });


  return body;
});
