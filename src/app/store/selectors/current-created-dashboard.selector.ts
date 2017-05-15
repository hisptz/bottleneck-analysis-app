import {ApplicationState} from "../application-state";
export function currentCreatedDashboardSelector(state: ApplicationState) {
  return state.uiState.currentCreatedDashboard;
}
