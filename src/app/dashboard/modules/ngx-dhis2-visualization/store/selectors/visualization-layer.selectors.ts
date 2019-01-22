import { createSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities,
  getVisualizationUiConfigurationEntities
} from '../reducers';
import {
  Visualization,
  VisualizationUiConfig,
  VisualizationLayer
} from '../../models';
import {
  getVisualizationMetadataIdentifiers,
  getVisualizationLayout
} from '../../helpers';

export const getCurrentVisualizationObjectLayers = (visualizationId: string) =>
  createSelector(
    getVisualizationObjectEntities,
    getVisualizationLayerEntities,
    (visualizationObjectEntities, visualizationLayerEntities) => {
      const currentVisualizationObject: Visualization =
        visualizationObjectEntities[visualizationId];
      if (!currentVisualizationObject) {
        return [];
      }

      return _.map(
        _.filter(
          _.map(
            currentVisualizationObject.layers,
            (layerId: string) => visualizationLayerEntities[layerId]
          ),
          (layer: VisualizationLayer) => layer
        ),
        (visualizationLayer: any) => {
          return {
            ...visualizationLayer,
            metadataIdentifiers: getVisualizationMetadataIdentifiers(
              visualizationLayer.dataSelections
            ),
            layout:
              visualizationLayer.layout ||
              getVisualizationLayout(visualizationLayer.dataSelections)
          };
        }
      );
    }
  );
