define([], function () {
  // Action Creators for the application
  return {
    readHostVmsAction () {
      return {
        type: 'READ_HOST_VMS'
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
