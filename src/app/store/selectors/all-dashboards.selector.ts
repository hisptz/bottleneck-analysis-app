import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {dashboardMenuItemsSelector} from './dashboard-menu-items.selector';
export function allDashboardsSelector(state: ApplicationState) {
  const newDashboardsIds = [];
  const compiledDashboards = [];
  state.storeData.customDashboardSettings.dashboardGroups
    .map(dashboardGroup => { return dashboardGroup.dashboards})
    .forEach(dashboardArray => {
      dashboardArray.forEach(dashboardId => {
        newDashboardsIds.push(dashboardId)
      })
    });
  return state.storeData.dashboards.map((dashboard: any) => {
    return {
      id: dashboard.id,
      name: dashboard.name,
      selected: newDashboardsIds.indexOf(dashboard.id) !== -1 ? true : false
    };
  });
}
