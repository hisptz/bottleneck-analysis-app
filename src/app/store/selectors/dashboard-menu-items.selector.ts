import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
import {Dashboard} from '../../model/dashboard';
import {dashboardsSelector} from './dashboards.selector';
export function dashboardMenuItemsSelector(state: ApplicationState) {
  const dashboards = dashboardsSelector(state);
  const dashboardSettings = state.storeData.customDashboardSettings;
  if (dashboards.length === 0) {
    return null;
  }
  const useDashboardGroup = dashboardSettings !== null ? dashboardSettings.useDashboardGroups : false;
  let dashboardMenuItems = _.map(dashboards, changeStateToDashboardMenu);
  //TODO change this after make the processing of loading settings immune
  if (useDashboardGroup === true) {
    const groupDashboards = _.groupBy(dashboardMenuItems, 'group');
    dashboardMenuItems = {
      groups: _.keys(groupDashboards),
      dashboards: groupDashboards
    };
  }
  return {
    showInGroupFormat: useDashboardGroup ? useDashboardGroup : false,
    dashboardsMenuItems: dashboardMenuItems
  }
}

function changeStateToDashboardMenu(dashboard: Dashboard) {
  return {
    id: dashboard.id,
    group: dashboard.group,
    name: dashboard.name,
    details: dashboard.details
  };
}
