import * as _ from 'lodash';
import { User } from '../models';
export function getCurrentDashboardId(
  routeUrl: string,
  dashboards: any[],
  currentUserInfo: User
) {
  let currentDashboard = routeUrl.split('/')[2];

  if (!_.find(dashboards, ['id', currentDashboard])) {
    if (currentUserInfo && currentUserInfo.userCredentials) {
      currentDashboard = localStorage.getItem(
        'dhis2.dashboard.current.' + currentUserInfo.userCredentials.username
      );

      if (!_.find(dashboards, ['id', currentDashboard])) {
        currentDashboard = dashboards[0] ? dashboards[0].id : '';
      }
    } else {
      currentDashboard = dashboards[0] ? dashboards[0].id : '';
    }
  }
  return currentDashboard;
}
