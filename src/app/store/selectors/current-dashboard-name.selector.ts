import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
export function currentDashboardNameSelector(state: ApplicationState) {
  let currentDashboardName: string = null;
  if (state.storeData.dashboards.length > 0 && state.uiState.currentDashboard !== undefined) {
    const currentDashboard = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);
    if (currentDashboard) {
      currentDashboardName = currentDashboard.name
    }
  }
  return currentDashboardName;
}
