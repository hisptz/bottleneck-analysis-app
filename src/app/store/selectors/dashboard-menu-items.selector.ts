import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
export function dashboardMenuItemsSelector(state: ApplicationState) {
  if(state.storeData.dashboards.length == 0) {
    return [];
  }
  return _.map(state.storeData.dashboards, changeStateToDashboardMenu)
}

function changeStateToDashboardMenu(dashboard) {
  return {
    id: dashboard.id,
    name: dashboard.name
  };
}
