import {ApplicationState} from '../application-state';

export function dashboardLoadedSelector(state: ApplicationState) {
  return state.uiState.dashboardLoaded;
}
