import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
export function dashboardItemsSelector(state: ApplicationState) {
  if (!state.storeData && state.uiState.currentDashboard === undefined) {
    return [];
  }
  const currentDashboard: any = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);
  return currentDashboard ? currentDashboard.dashboardItems : [];
}
