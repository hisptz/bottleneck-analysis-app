import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
import {Dashboard} from '../../model/dashboard';
export function dashboardMenuItemsSelector(state: ApplicationState) {
  if (state.storeData.dashboards.length === 0) {
    return [];
  }
  return _.map(state.storeData.dashboards, changeStateToDashboardMenu)
}

function changeStateToDashboardMenu(dashboard: Dashboard) {
  return {
    id: dashboard.id,
    name: dashboard.name,
    details: dashboard.details
  };
}
