import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromLayers from './layers.reducer';
import * as fromVisualizationObject from './visualization-object.reducers';
import * as fromGeofeatures from './geo-feature.reducers';
import * as fromLegendSets from './legend-set.reducers';
import * as fromVisualizationLegend from './visualization-legend.reducers';
import * as fromBaseLayerLegend from './base-layer.reducers';
import * as fromLegendSetsConfig from './legendSet-config.reducers';
import * as fromUISettingsConfig from './ui-settings.reducers';

export interface MapState {
  baselayerLegend: fromBaseLayerLegend.BaseLayerState;
  visualizationObjects: fromVisualizationObject.VisualizationObjectState;
  legendSets: fromLegendSets.LegendSetState;
  visualizationLegend: fromVisualizationLegend.VisualizationLegendState;
  legendsetsConfig: fromLegendSetsConfig.LegendSetState;
  uiSettings: fromUISettingsConfig.UISettingState;
}

export const reducers: ActionReducerMap<MapState> = {
  baselayerLegend: fromBaseLayerLegend.reducer,
  visualizationObjects: fromVisualizationObject.reducer,
  legendSets: fromLegendSets.reducer,
  visualizationLegend: fromVisualizationLegend.reducer,
  legendsetsConfig: fromLegendSetsConfig.legendSetReducer,
  uiSettings: fromUISettingsConfig.reducer
};

export const getMapState = createFeatureSelector<MapState>('map');
