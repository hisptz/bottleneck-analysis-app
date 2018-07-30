import { createSelector } from '@ngrx/store';
import { getCurrentDashboardId } from './dashboard.selectors';
import { getDashboardVisualizationEntities } from '../reducers/dashboard-visualization.reducer';

export const getCurrentDashboardVisualizations = createSelector(
  getDashboardVisualizationEntities,
  getCurrentDashboardId,
  (dashboardVisualizationEntities, currentDashboardId) => {
    const dashboardVisualizations =
      dashboardVisualizationEntities[currentDashboardId];
    return dashboardVisualizations ? dashboardVisualizations.items : [];
  }
);
