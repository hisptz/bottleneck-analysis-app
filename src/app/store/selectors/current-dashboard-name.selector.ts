import * as _ from 'lodash';
import {ApplicationState} from '../application-state';
import {dashboardsSelector} from './dashboards.selector';
export function currentDashboardNameSelector(state: ApplicationState) {
  const dashboards = dashboardsSelector(state);
  let currentDashboardName: string = null;
  if (dashboards.length > 0 && state.uiState.currentDashboard !== undefined) {
    const currentDashboard = _.find(dashboards, ['id', state.uiState.currentDashboard]);
    if (currentDashboard) {
      currentDashboardName = currentDashboard.name
    }
  }
  return currentDashboardName;
}
