import {ApplicationState} from "../application-state";
export function currentDashboardSelector(state: ApplicationState) {
  return state.uiState.currentDashboard;
}
