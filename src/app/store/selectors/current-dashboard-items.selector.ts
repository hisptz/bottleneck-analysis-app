import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
export function currentDashboardItemsSelector(state: ApplicationState) {
  let currentDashboardItems: any = [];
  if(state.storeData.dashboards.length > 0 && state.uiState.currentDashboard != undefined) {
    const currentDashboard = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);
    if(currentDashboard) {
      currentDashboardItems = currentDashboard.dashboardItems
    }
  }
  return currentDashboardItems;
}
