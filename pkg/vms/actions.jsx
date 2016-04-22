define([], function () {
  // Action Creators for the application
  return {
    myCustomAction (param) {
      return {
        type: 'MY_CUSTOM_ACTION',
        param
      };
    }
  };
});
