/**
 * Middleware that resolves functions taking (dispatch, getState) and promises.
 *
 * If a promise is passed the dispatch will just return the passed promise.
 * This is done to simplify some client code that can sometime dispatch a promise and sometimes a plain action.
 *
 * If a function is passed (which is not a promise) we perform the usual injection of (dispatch, getState).
 */
export function thunk({ dispatch, getState }) {
  console.log('thunk-middleware');

  return next => action => {
    if (typeof action === 'function') {
      // cockpit style promise is also typeof 'function'
      // so we differentiate between those two by the presence of property 'then'
      return action.then
        ? action
        : action(dispatch, getState);
    }

    return next(action);
  };
}
