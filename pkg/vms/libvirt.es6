/*
 * Provider for Libvirt
 */
import cockpit from 'base1/cockpit';
import $ from 'jquery';
import { /*dbus,*/ clearVms, updateOrAddVm, deleteVm, getVm, getAllVms, delay, noAction, deleteUnlistedVMs } from 'vms/actions';
import { spawnScript, spawnProcess } from 'vms/services';
import { toMegaBytes, isEmpty } from 'vms/helpers';

export default {
  name: 'LibvirtProvider',

  /**
   * Register signal handlers
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

    return dispatch => {
      if (!isEmpty(name)) {
        spawnProcess({
          cmd: 'virsh',
          args: ['-r', 'dumpxml', name]
        }).then(output => { // output is xml from dumpxml
//          console.log(`GET_VM() output: ${output}`);
            const xmlDoc = $.parseXML(output);

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

            spawnProcess({
              cmd: 'virsh',
              args: ['-r', 'domstate', name]
            }).then(output => {
              const state = output.trim();
              dispatch(updateOrAddVm({name, state}));
            });
          }
        );
      }
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
      spawnScript({
        script: 'virsh -r list --all | awk \'$1 == "-" || $1+0 > 0 { print $2 }\''
      }).then(
        output => {
          const vmNames = output.trim().split(/\r?\n/);
          vmNames.forEach((vmName, index) => {
            vmNames[index] = vmName.trim();
          });
          console.log(`GET_ALL_VMS: vmNames: ${JSON.stringify(vmNames)}`);

          // TODO: detect removed machines
          // remove undefined domains
          dispatch(deleteUnlistedVMs(vmNames));

          // read VM details
          vmNames.forEach((name) => {
            dispatch(getVm(name))
          });

          // keep polling
          dispatch(delay(getAllVms()));
        }
      );
    };
  },

  SHUTDOWN_VM ({ name }) {
    console.log(`${this.name}.SHUTDOWN_VM(${name}):`);
    return spawnAndForget('SHUTDOWN_VM', 'shutdown', name);
  },

  FORCEOFF_VM ({ name }) {
    console.log(`${this.name}.FORCEOFF_VM(${name}):`);
    return spawnAndForget('FORCEOFF_VM', 'destroy', name);
  },

  REBOOT_VM ({ name }) {
    console.log(`${this.name}.REBOOT_VM(${name}):`);
    return spawnAndForget('REBOOT_VM', 'reboot', name);
  },

  FORCEREBOOT_VM ({ name }) {
    console.log(`${this.name}.FORCEREBOOT_VM(${name}):`);
    return spawnAndForget('FORCEREBOOT_VM', 'reset', name);
  },

  START_VM ({ name }) {
    console.log(`${this.name}.START_VM(${name}):`);
    return spawnAndForget('START_VM', 'start', name);
  }
}

// TODO: add configurable custom virsh attribs - i.e. connection URI and libvirt user/pwd
function spawnAndForget (method, arg1, arg2 ) {
  spawnProcess({
    cmd: 'virsh',
    args: [arg1, arg2]
  }).catch( (ex, data, output) => {console.error(`${method}() exception: '${ex}', data: '${data}', output: '${output}'`);});

  return noAction();
}