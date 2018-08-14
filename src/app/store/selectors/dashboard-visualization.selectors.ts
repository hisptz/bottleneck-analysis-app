import { createSelector } from '@ngrx/store';
import { getCurrentDashboardId } from './dashboard.selectors';
import {
  getDashboardVisualizationEntitiesState,
  getVisualizationsReadyState,
  DashboardVisualizationState
} from '../reducers/dashboard-visualization.reducer';
import { getRootState, State } from '../reducers';

export const getDashboardVisualizationState = createSelector(
  getRootState,
  (state: State) => state.dashboardVisualization
);

export const getDashboardVisualizationEntities = createSelector(
  getDashboardVisualizationState,
  getDashboardVisualizationEntitiesState
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

export const getVisualizationReady = createSelector(
  getDashboardVisualizationState,
  (state: DashboardVisualizationState) => state.visualizationsReady
);
