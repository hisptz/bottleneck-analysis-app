import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
import {dashboardsSelector} from './dashboards.selector';
export function dashboardItemsSelector(state: ApplicationState) {
  const dashboards = _.clone(dashboardsSelector(state));
  if (dashboards.length === 0 && !state.uiState.currentDashboard) {
    return [];
  }
  const currentDashboard: any = _.find(dashboards, ['id', state.uiState.currentDashboard]);
  console.log(state.uiState.currentDashboard)
  return currentDashboard ? currentDashboard.dashboardItems : [];
}
