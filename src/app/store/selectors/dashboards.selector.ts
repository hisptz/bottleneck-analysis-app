import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {addArrayItem} from '../../utilities/addArrayItem';
export function dashboardsSelector (state: ApplicationState) {
  let newDashboards = [];

  if (state.storeData.customDashboardSettings !== null && state.storeData.dashboards.length > 0) {
    if (state.storeData.customDashboardSettings.useDashboardGroups) {
      const dashboardGroups: any[] = _.clone(state.storeData.customDashboardSettings.dashboardGroups);
      if (dashboardGroups) {
        dashboardGroups.forEach(dashboardGroup => {
          if (dashboardGroup.dashboards) {
            dashboardGroup.dashboards.forEach(dashboardId => {
              const dashboard =  _.find(state.storeData.dashboards, ['id', dashboardId]);
              if (dashboard) {
                dashboard.group = dashboardGroup.name;
                newDashboards = addArrayItem(newDashboards, dashboard, 'id');
              }
            })
          }
        });
      }
    } else {
      newDashboards = _.assign([], state.storeData.dashboards);
    }
  } else {
    newDashboards = _.assign([], state.storeData.dashboards);;
  }
  return newDashboards;
}
