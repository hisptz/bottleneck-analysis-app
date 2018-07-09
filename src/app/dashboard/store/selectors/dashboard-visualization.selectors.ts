import { createSelector } from '@ngrx/store';
import { DashboardState, getDashboardState } from '../reducers';
import { getCurrentDashboardId } from './dashboard.selectors';
import { selectDashboardVisualizationEntities } from '../reducers/dashboard-visualization.reducer';

export const getDashboardVisualizationState = createSelector(
  getDashboardState,
  (state: DashboardState) => state.dashboardVisualization
);

export const getDashboardVisualizationEntities = createSelector(
  getDashboardVisualizationState,
  selectDashboardVisualizationEntities
);

export const getCurrentDashboardVisualizations = createSelector(
  getDashboardVisualizationEntities,
  getCurrentDashboardId,
  (dashboardVisualizationEntities, currentDashboardId) => {
    const dashboardVisualizations =
      dashboardVisualizationEntities[currentDashboardId];
    return dashboardVisualizations ? dashboardVisualizations.items : [];
  }
);
