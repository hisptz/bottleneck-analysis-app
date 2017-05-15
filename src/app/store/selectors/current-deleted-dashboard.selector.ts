import {ApplicationState} from "../application-state";
export function currentDeletedDashboardSelector(state: ApplicationState) {
  return state.uiState.currentDeletedDashboard;
}
