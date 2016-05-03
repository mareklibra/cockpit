import { dbus, setVms } from 'vms/actions';

export default {
  name: 'machined',

  GET_ALL_VMS () {
    return dispatch => {
      dispatch(dbus({
        name: 'org.freedesktop.machine1',
        iface: 'org.freedesktop.machine1.Manager',
        path: '/org/freedesktop/machine1',
        method: 'ListMachines'
      })).then(result => {
        // assuming result is a list of VMS, TODO: verify
        dispatch(setVms(result));
      })
    }
  },

  DESTROY_VM ({ name }) {
    return dbus({
      name: 'org.freedesktop.machine1',
      iface: 'org.freedesktop.machine1.Manager',
      path: '/org/freedesktop/machine1',
      method: 'TerminateMachine',
      args: [name]
    })
  }
};
