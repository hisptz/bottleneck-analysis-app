import {ApplicationState} from '../application-state';
export function dashboardNotificationSelector(state: ApplicationState) {
  return state.storeData.dashboardNotification;
}
