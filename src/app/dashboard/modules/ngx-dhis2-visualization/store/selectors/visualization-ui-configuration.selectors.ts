import {
  getVisualizationObjectEntities,
  getVisualizationUiConfigurationEntities,
  getVisualizationUiConfigurationState
} from '../reducers';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { Visualization, VisualizationUiConfig } from '../../models';
import { getFocusedVisualizationState } from '../reducers/visualization-ui-configuration.reducer';
export const getCurrentVisualizationUiConfig = (visualizationId: string) =>
  createSelector(
    getVisualizationObjectEntities,
    getVisualizationUiConfigurationEntities,
    (visualizationObjectEntities, visualizationUiConfigurationEntities) => {
      const currentVisualizationObject: Visualization =
        visualizationObjectEntities[visualizationId];
      if (!currentVisualizationObject) {
        return null;
      }

      return visualizationUiConfigurationEntities[
        currentVisualizationObject.uiConfigId
      ];
    }
  );

export const getFocusedVisualization = createSelector(
  getVisualizationUiConfigurationState,
  getFocusedVisualizationState
);
