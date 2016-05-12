/*
 * Provider for machined
 */
import cockpit from 'base1/cockpit';
import { /*dbus,*/ spawnProcess, spawnScript, clearVms, updateOrAddVm, deleteVm, getVm, getAllVms, delay } from 'vms/actions';
import $ from 'jquery';

function toMegaBytes(amount, currentUnit) {
  console.log(`toMegaBytes('${amount}', '${currentUnit}') `);
  switch (currentUnit) {
    case 'KiB':
      return amount / 1024;
    default:
      console.error(`toMegaBytes(): unknown unit: ${currentUnit}`);
  }
  return amount;
}

export default {
  name: 'machined',

  /**
   * Register machined signal handlers
   *
   * @returns {Function}
   */
  INIT () {
    console.log(`${this.name}.INIT()`);

    return {type: 'NONE'}
/*
    return dispatch => dispatch(dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      signal: (event, name, args) => {
        switch (name) {
          case 'MachineNew':
            console.log('New machine detected: ' + JSON.stringify({ event, name, args }));
            const path = args[1]; // /org/freedesktop/machine1/machine/qemu_2d6_2dmySecondVM
//            dispatch(getVmDetail(path)); TODO: change with libvirt
            break;
          case 'MachineRemoved':
            console.log('Machine removed: ' + JSON.stringify({ event, name, args }));
            dispatch(deleteVm({ name: args[0] }));
            break;
          default:
            console.error(`machined.INIT(): unhandled signal ${name}`);
        }
      }}));*/
  },

  /**
   * read VM properties (virsh)
   *
   * @param VM name
   * @returns {Function}
   */
  GET_VM ({ lookupId: name }) {
    console.log(`${this.name}.GET_VM()`);

    return dispatch => {dispatch(
        spawnProcess({
          cmd: 'virsh',
          args: ['-r', 'dumpxml', name]
        })).then(output => { // output is xml from dumpxml
//          console.log(`GET_VM() output: ${output}`);
          const xmlDoc = $.parseXML( output );

          const domainElem = xmlDoc.getElementsByTagName("domain")[0];
          const osElem = domainElem.getElementsByTagName("os")[0]
          const currentMemoryElem = domainElem.getElementsByTagName("currentMemory")[0]

          const name = domainElem.getElementsByTagName("name")[0].childNodes[0].nodeValue
          const id = domainElem.getElementsByTagName("uuid")[0].childNodes[0].nodeValue
          const osType = osElem.getElementsByTagName("type")[0].childNodes[0].nodeValue

          const currentMemoryUnit = currentMemoryElem.getAttribute("unit")
          const currentMemory = toMegaBytes(currentMemoryElem.childNodes[0].nodeValue, currentMemoryUnit);

          dispatch(updateOrAddVm({name, id, osType, currentMemory}));
          // TODO: uptime
          // TODO: fqdn
          // TODO: domain/cpu
          // TODO: cpu, mem, disk, network usage

          dispatch(spawnProcess({
              cmd: 'virsh',
              args: ['-r', 'domstate', name]
            })).then(output => {
              const state = output.trim();
              dispatch(updateOrAddVm({name, state}));
            });
        }
      );
    };
  },

  /**
   * Initiate read of all VMs
   *
   * @returns {Function}
   */
  GET_ALL_VMS () {
    console.log(`${this.name}.GET_ALL_VMS():`);
    return dispatch => {
      dispatch(
        spawnScript({
          script: 'virsh -r list --all | awk \'$1 == "-" || $1+0 > 0 { print $2 }\''
        })
      ).then(
        output => {
          let vmNames = output.trim().split(/\r?\n/);
          console.log(`GET_ALL_VMS: vmNames: ${JSON.stringify(vmNames)}`);

          vmNames.forEach((name) => dispatch(getVm(name)));

          // keep polling
          dispatch(delay(getAllVms()));
        }
      );
    };
  },

  /**
   * Invoke shutdown on a VM.
   *
   * @param name
   * @returns {*}
   */
  SHUTDOWN_VM ({ name }) {
    console.log(`${this.name}.SHUTDOWN_VM():`);
    return {}
/*TODO
    return dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'TerminateMachine',
      args: [name]
    })*/
  }

};
