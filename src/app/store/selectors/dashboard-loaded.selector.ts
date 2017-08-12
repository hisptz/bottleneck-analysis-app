import {ApplicationState} from '../application-state';

export function dashboardLoadedSelector(state: ApplicationState) {
  return state.uiState.dashboardCustomSettingsLoaded &&
  state.uiState.dashboardLoaded && state.uiState.favoriteOptionsLoaded ? true : false;
}
