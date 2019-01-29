import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { getCurrentDashboardId } from './dashboard.selectors';
import * as fromDashboardVisualizationReducer from '../reducers/dashboard-visualization.reducer';
import { DashboardVisualization } from '../../models';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities
} from '../../modules/ngx-dhis2-visualization/store';
import {
  Visualization,
  VisualizationLayer,
  VisualizationDataSelection
} from '../../modules/ngx-dhis2-visualization/models';
import { getSelectionDimensionsFromAnalytics } from '../../modules/ngx-dhis2-visualization/helpers';

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
    const visualizationLayers: VisualizationLayer[] = _.map(
      _.flatten(
        _.map(
          _.flatten(
            _.map(
              dashboardVisualizationItems,
              (dashboardVisualizationItem: any) =>
                visualizationObjectEntities[dashboardVisualizationItem.id]
            )
          ),
          visualization => visualization.layers
        )
      ),
      layerId => visualizationLayerEntities[layerId]
    );

    const globalDataSelectionsArray = _.map(
      visualizationLayers,
      (visualizationLayer: VisualizationLayer) => {
        return getSelectionDimensionsFromAnalytics(
          visualizationLayer.analytics
        );
      }
    );

    let mergedDataSelections = [];

    _.each(
      globalDataSelectionsArray,
      (dataSelections: VisualizationDataSelection[]) => {
        _.each(dataSelections, (dataSelection: VisualizationDataSelection) => {
          const avaialableDataSelection = _.find(mergedDataSelections, [
            'dimension',
            dataSelection.dimension
          ]);
          if (avaialableDataSelection) {
            const avaialableDataSelectionIndex = mergedDataSelections.indexOf(
              avaialableDataSelection
            );
            mergedDataSelections = [
              ..._.slice(mergedDataSelections, 0, avaialableDataSelectionIndex),
              {
                ...avaialableDataSelection,
                ...dataSelection,
                items: _.uniqBy(
                  [...avaialableDataSelection.items, ...dataSelection.items],
                  'id'
                )
              },
              ..._.slice(mergedDataSelections, avaialableDataSelectionIndex + 1)
            ];
          } else {
            mergedDataSelections = [...mergedDataSelections, dataSelection];
          }
        });
      }
    );

    return mergedDataSelections;
  }
);
