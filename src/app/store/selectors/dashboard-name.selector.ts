import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
export function dashboardNameSelector(state: ApplicationState) {
  let currentDashboardName: string = null;
  if(state.storeData.dashboards.length > 0 && state.uiState.currentDashboard != undefined) {
    const currentDashboard = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);
    if(currentDashboard) {
      currentDashboardName = currentDashboard.name
    }
  }
  return currentDashboardName;
}
