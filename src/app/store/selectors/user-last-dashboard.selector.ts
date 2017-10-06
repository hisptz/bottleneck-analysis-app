import {ApplicationState} from '../application-state';
import {dashboardsSelector} from './dashboards.selector';
export function userLastDashboardSelector(state: ApplicationState) {
  const dashboards = dashboardsSelector(state);
  if (dashboards.length === 0) {
    return '';
  }
  if (!state.storeData.currentUser.userCredentials.hasOwnProperty('username')) {
    return '';
  }
  const username: string = state.storeData.currentUser.userCredentials.username;
  let lastDashboardId: string = localStorage.getItem('dhis2.dashboard.current.' + username);


  if (lastDashboardId === null || lastDashboardId === undefined) {
    if (state.storeData.dashboards.length > 0) {
      lastDashboardId = state.storeData.dashboards[0].id;
      localStorage.setItem('dhis2.dashboard.current.' + username, lastDashboardId)
    }
  }

  return dashboards[0].id
}
