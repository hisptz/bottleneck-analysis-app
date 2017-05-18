import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
export function currentDashboardItemsSelector(state: ApplicationState) {
  let currentDashboard: any = undefined;

  if(state.storeData.dashboards.length > 0 && state.uiState.currentDashboard != undefined) {
    currentDashboard = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);

  }
  return currentDashboard != undefined ? currentDashboard.dashboardItems : [];
}
