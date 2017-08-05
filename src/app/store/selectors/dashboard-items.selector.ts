import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
import {dashboardsSelector} from './dashboards.selector';
export function dashboardItemsSelector(state: ApplicationState) {
  const dashboards = dashboardsSelector(state);
  if (dashboards.length === 0 && state.uiState.currentDashboard === undefined) {
    return [];
  }
  const currentDashboard: any = _.find(dashboards, ['id', state.uiState.currentDashboard]);
  return currentDashboard ? currentDashboard.dashboardItems : [];
}
