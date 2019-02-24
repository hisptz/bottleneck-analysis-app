import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromLayers from './layers.reducer';
import * as fromVisualizationObject from './visualization-object.reducers';
import * as fromLegendSets from './legend-set.reducers';
import * as fromVisualizationLegend from './visualization-legend.reducers';
import * as fromBaseLayerLegend from './base-layer.reducers';

export interface MapState {
  baselayerLegend: fromBaseLayerLegend.BaseLayerState;
  visualizationObjects: fromVisualizationObject.VisualizationObjectState;
  legendSets: fromLegendSets.LegendSetState;
  visualizationLegend: fromVisualizationLegend.VisualizationLegendState;
  layerVisibility: fromLayers.LayerVisibilityState;
}

export const reducers: ActionReducerMap<MapState> = {
  baselayerLegend: fromBaseLayerLegend.reducer,
  visualizationObjects: fromVisualizationObject.reducer,
  legendSets: fromLegendSets.reducer,
  visualizationLegend: fromVisualizationLegend.reducer,
  layerVisibility: fromLayers.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');
