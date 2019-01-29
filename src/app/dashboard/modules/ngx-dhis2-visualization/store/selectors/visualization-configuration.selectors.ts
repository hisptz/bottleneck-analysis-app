import { getVisualizationConfigurationEntities } from '../reducers';
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
    getVisualizationConfigurationEntities,
    visualizationConfigurationEntities =>
      visualizationConfigurationEntities[visualizationId]
  );
