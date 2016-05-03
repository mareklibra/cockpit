define([], function () {
  // Action Creators for the application
  return {
    readHostVmsAction () {
      return {
        type: 'DBUS',
        server: ''
      };
    },


    myCustomAction (vmId) {
      return {
        type: 'MY_CUSTOM_ACTION',
        vmId: vmId
      };
    }
  };
});
