import {ApplicationState} from '../application-state';
export function favoriteSelector(state: ApplicationState) {
  return state.storeData.favorites;
}
