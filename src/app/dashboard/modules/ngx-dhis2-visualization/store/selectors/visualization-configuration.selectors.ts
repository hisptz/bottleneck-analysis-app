import {
  getVisualizationObjectEntities,
  getVisualizationConfigurationEntities
} from '../reducers';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  Visualization,
  VisualizationConfig,
  VisualizationUiConfig,
  VisualizationLayer,
  VisualizationLayout
} from '../../models';

export const getCurrentVisualizationConfig = (visualizationId: string) =>
  createSelector(
    getVisualizationObjectEntities,
    getVisualizationConfigurationEntities,
    (visualizationObjectEntities, visualizationConfigurationEntities) => {
      const currentVisualizationObject: Visualization =
        visualizationObjectEntities[visualizationId];
      if (!currentVisualizationObject) {
        return null;
      }

      return visualizationConfigurationEntities[
        currentVisualizationObject.visualizationConfigId
      ];
    }
  );
