import {ApplicationState} from '../application-state';
export function currentUserSelector(state: ApplicationState) {
  return state.storeData.currentUser;
}
