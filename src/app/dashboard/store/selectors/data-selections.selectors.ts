import { createSelector } from '@ngrx/store';
import { getCurrentDashboardVisualizationItems } from './dashboard-visualization.selectors';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities,
} from '../../modules/ngx-dhis2-visualization/store';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';
import { getDataSelectionsFromVisualizationLayers } from '../../helpers/get-data-selections-from-visualization-layers.helper';
import {
  getCombinedVisualizationLayers,
  getDataSelectionSummary,
  getMergedGlobalDataSelectionsFromVisualizationLayers,
} from '../../helpers';
import { getCurrentDashboard } from './dashboard.selectors';
import { Dashboard } from '../../models';

export const getCurrentGlobalDataSelections = (getFromAnalytics) =>
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
      return getMergedGlobalDataSelectionsFromVisualizationLayers(
        dataSelectionsArray
      );
    }
  );

export const getGlobalDataSelectionSummary = createSelector(
  getCurrentGlobalDataSelections(true),
  (globalDataSelections: VisualizationDataSelection[]) =>
    getDataSelectionSummary(globalDataSelections)
);

export const getCurrentDashboardDownloadFilename = createSelector(
  getCurrentDashboard,
  getGlobalDataSelectionSummary,
  (dashboard: Dashboard, selectionSummary) => {
    const date = new Date();
    const filename = (dashboard
      ? `${dashboard.name}${selectionSummary ? ' - ' + selectionSummary : ''}`
      : 'bna intervention'
    ).toLowerCase();
    return `${filename}:${date.toISOString()}`;
  }
);
