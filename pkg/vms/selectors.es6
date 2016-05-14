/*
 * Selectors are pattern that enables to decouple the View layer from the exact layout of
 * the state in Redux store. This also enables to put derived (computed) data on the same level
 * as the objects stored in the store directly.
 *
 * Reference: http://redux.js.org/docs/recipes/ComputingDerivedData.html
 */


export function getRefreshInterval (state) {
  return state.config.refreshInterval;
}
