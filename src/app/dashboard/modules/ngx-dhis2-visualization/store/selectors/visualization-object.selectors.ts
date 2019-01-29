import { createSelector, MemoizedSelector } from '@ngrx/store';
import { getVisualizationObjectEntities } from '../reducers';
import { Visualization, VisualizationProgress } from '../../models';
import { getCurrentVisualizationConfig } from './visualization-configuration.selectors';
import { getCurrentVisualizationObjectLayers } from './visualization-layer.selectors';

export const getVisualizationObjectById = id =>
  createSelector(
    getVisualizationObjectEntities,
    visualizationObjectEntity => visualizationObjectEntity[id]
  );

export const getCombinedVisualizationObjectById = id =>
  createSelector(
    getVisualizationObjectById(id),
    getCurrentVisualizationConfig(id),
    getCurrentVisualizationObjectLayers(id),
    (visualizationObject, visualizationConfig, visualizationLayers) => {
      return visualizationObject
        ? {
            ...visualizationObject,
            config: visualizationConfig,
            layers: visualizationLayers
          }
        : null;
    }
  );

export const getCurrentVisualizationProgress = id =>
  createSelector(getVisualizationObjectEntities, visualizationObjectEntity => {
    const currentVisualizationObject: Visualization =
      visualizationObjectEntity[id];

    return currentVisualizationObject
      ? currentVisualizationObject.progress
      : null;
  });
