import {ApplicationState} from "../application-state";
export function userLastDashboardSelector(state: ApplicationState) {

  if(!state.storeData.currentUser.userCredentials.hasOwnProperty('username')) {
    return null
  }
  const username: string = state.storeData.currentUser.userCredentials.username;
  let lastDashboardId: string = localStorage.getItem('dhis2.dashboard.current.' + username);


  if(lastDashboardId == null || lastDashboardId == undefined) {
    if(state.storeData.dashboards.length > 0) {
      lastDashboardId = state.storeData.dashboards[0].id;
      localStorage.setItem('dhis2.dashboard.current.' + username,lastDashboardId)
    }
  }

  return lastDashboardId
}
