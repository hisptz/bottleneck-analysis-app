import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { getCurrentDashboardId } from './dashboard.selectors';
import * as fromDashboardVisualizationReducer from '../reducers/dashboard-visualization.reducer';
import { DashboardVisualization } from '../../models';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities
} from '../../modules/ngx-dhis2-visualization/store';
import { Visualization } from '../../modules/ngx-dhis2-visualization/models';

export const getCurrentDashboardVisualization = createSelector(
  fromDashboardVisualizationReducer.getDashboardVisualizationEntities,
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
    fromDashboardVisualizationReducer.getDashboardVisualizationEntities,
    dashboardVisualizationEntities => dashboardVisualizationEntities[id]
  );

export const getVisualizationReady = createSelector(
  fromDashboardVisualizationReducer.getDashboardVisualizationState,
  (state: fromDashboardVisualizationReducer.State) => state.visualizationsReady
);

export const getCurrentGlobalDataSelections = createSelector(
  getCurrentDashboardVisualizationItems,
  getVisualizationObjectEntities,
  getVisualizationLayerEntities,
  (
    dashboardVisualizationItems: any,
    visualizationObjectEntities: any,
    visualizationLayerEntities: any
  ) => {
    console.log(
      _.flatten(
        _.map(
          dashboardVisualizationItems,
          (dashboardVisualizationItem: any) =>
            visualizationObjectEntities[dashboardVisualizationItem.id]
        )
      )
    );

    return [];
  }
);
