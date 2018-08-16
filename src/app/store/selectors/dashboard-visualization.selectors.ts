import { createSelector } from '@ngrx/store';
import { getCurrentDashboardId } from './dashboard.selectors';
import {
  getDashboardVisualizationEntitiesState,
  DashboardVisualizationState
} from '../reducers/dashboard-visualization.reducer';
import { getRootState, State } from '../reducers';
import { DashboardVisualization } from '../../dashboard/models';

export const getDashboardVisualizationState = createSelector(
  getRootState,
  (state: State) => state.dashboardVisualization
);

export const getDashboardVisualizationEntities = createSelector(
  getDashboardVisualizationState,
  getDashboardVisualizationEntitiesState
);

export const getCurrentDashboardVisualization = createSelector(
  getDashboardVisualizationEntities,
  getCurrentDashboardId,
  (dashboardVisualizationEntities, currentDashboardId) =>
    dashboardVisualizationEntities[currentDashboardId]
);

export const getCurrentDashboardVisualizationItems = createSelector(
  getCurrentDashboardVisualization,
  (currentDashboardVisualization: DashboardVisualization) =>
    currentDashboardVisualization ? currentDashboardVisualization.items : []
);

export const getCurrentDashboardVisualizationLoading = createSelector(
  getCurrentDashboardVisualization,
  (currentDashboardVisualization: DashboardVisualization) =>
    currentDashboardVisualization ? currentDashboardVisualization.loading : true
);

export const getCurrentDashboardVisualizationLoaded = createSelector(
  getCurrentDashboardVisualization,
  (currentDashboardVisualization: DashboardVisualization) =>
    currentDashboardVisualization ? currentDashboardVisualization.loaded : false
);

export const getDashboardVisualizationById = id =>
  createSelector(
    getDashboardVisualizationEntities,
    dashboardVisualizationEntities => dashboardVisualizationEntities[id]
  );

export const getVisualizationReady = createSelector(
  getDashboardVisualizationState,
  (state: DashboardVisualizationState) => state.visualizationsReady
);
