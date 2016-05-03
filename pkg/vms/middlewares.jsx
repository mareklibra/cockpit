function getVirtProvider (config) {
  if (config.provider == TODO) {
    dispatch// TODO
  }
  return new Promise();// TODO
}

define({
  thunk({ dispatch, getState }) {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      return next(action);
    };
  },

  virt({ dispatch, getState }) {
    return next => action => {
      if (action.type === 'VIRT') {
        getVirtProvider(getState().config).then(provider => {
          const method = action.method;
          if (provider.supports(method)) {
            dispatch(provider.getAction(action));
            console.warn(`method: ${method} is not supported by provider: ${provider.name}`);
          }
        }).catch(err => {
          console.error('could not detect any virt provider');
        })
      }

      return next(action);
    }
  },

  machined({ dispatch, getState }) {
    return next => action => {
      // TODO
      return next(action);
    }
  },

  dbus({ dispatch, getState }) {
    return next => action => {

    }
  }
});



