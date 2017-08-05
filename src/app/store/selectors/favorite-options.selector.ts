import {ApplicationState} from '../application-state';
export function favoriteOptionsSelector (state: ApplicationState) {
  return state.storeData.favoriteOptions;
}
