import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromVisualizationLegend from '../reducers/visualization-legend.reducers';

export const getVisualizationLegendState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.visualizationLegend
);

export const isVisualizationLegendOpen = createSelector(
  getVisualizationLegendState,
  fromVisualizationLegend.getVisualizationLegendOpen
);

export const isVisualizationLegendPinned = createSelector(
  getVisualizationLegendState,
  fromVisualizationLegend.getVisualizationLegendPinned
);

export const isVisualizationLegendFilterSectionOpen = createSelector(
  getVisualizationLegendState,
  fromVisualizationLegend.getVisualizationLegendFilterSectionOpen
);
