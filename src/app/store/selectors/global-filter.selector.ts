import {ApplicationState} from '../application-state';
export function globalFilterSelector(state: ApplicationState) {
  return state.storeData.globalFilters;
}
