import { createSelector } from '@ngrx/store';

import {
  getCombinedVisualizationLayers,
  getDataSelectionSummary,
  getMergedGlobalDataSelectionsFromVisualizationLayers as getMergedGlobalDataSelections
} from '../../helpers';
import { getDataSelectionsFromVisualizationLayers } from '../../helpers/get-data-selections-from-visualization-layers.helper';
import { DashboardVisualization } from '../../models';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';
import {
  getVisualizationLayerEntities,
  getVisualizationObjectEntities
} from '../../modules/ngx-dhis2-visualization/store';
import * as fromDashboardVisualizationReducer from '../reducers/dashboard-visualization.reducer';
import { getCurrentDashboardId } from './dashboard.selectors';

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

export const getCurrentGlobalDataSelections = getFromAnalytics =>
  createSelector(
    getCurrentDashboardVisualizationItems,
    getVisualizationObjectEntities,
    getVisualizationLayerEntities,
    (
      dashboardVisualizationItems: any,
      visualizationObjectEntities: any,
      visualizationLayerEntities: any
    ) => {
      const dataSelectionsArray: Array<
        VisualizationDataSelection[]
      > = getDataSelectionsFromVisualizationLayers(
        getCombinedVisualizationLayers(
          dashboardVisualizationItems,
          visualizationObjectEntities,
          visualizationLayerEntities
        ),
        getFromAnalytics
      );
      return getMergedGlobalDataSelections(dataSelectionsArray);
    }
  );

export const getGlobalDataSelectionSummary = createSelector(
  getCurrentGlobalDataSelections(true),
  (globalDataSelections: VisualizationDataSelection[]) =>
    getDataSelectionSummary(globalDataSelections)
);
