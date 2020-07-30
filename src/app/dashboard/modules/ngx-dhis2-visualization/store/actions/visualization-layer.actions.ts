import { Action } from '@ngrx/store';
import { VisualizationLayer, VisualizationDataSelection } from '../../models';
import { Update } from '@ngrx/entity';

export enum VisualizationLayerActionTypes {
  ADD_VISUALIZATION_LAYER = '[VisualizationLayer] Add visualization layer',
  UPDATE_VISUALIZATION_LAYER = '[VisualizationLayer] Update visualization layer',
  UPDATE_VISUALIZATION_LAYERS = '[VisualizationLayer] Update visualization layers',
  LOAD_VISUALIZATION_ANALYTICS = '[VisualizationLayer] Load visualization analytics',
  LOAD_VISUALIZATION_ANALYTICS_SUCCESS = '[VisualizationLayer] Load visualization analytics success',
  LOAD_VISUALIZATION_ANALYTICS_FAIL = '[VisualizationLayer] Load visualization analytics fail',
  ReplaceVisualizationLayerId = '[VisualizationLayer] Replace visualization layer id',
  RemoveVisualizationLayer = '[VisualizationLayer] Remove visualization layer',
}

export class AddVisualizationLayerAction implements Action {
  readonly type = VisualizationLayerActionTypes.ADD_VISUALIZATION_LAYER;

  constructor(public visualizationLayer: VisualizationLayer) {}
}

export class UpdateVisualizationLayerAction implements Action {
  readonly type = VisualizationLayerActionTypes.UPDATE_VISUALIZATION_LAYER;
  constructor(public id: string, public changes: Partial<VisualizationLayer>) {}
}

export class UpdateVisualizationLayersAction implements Action {
  readonly type = VisualizationLayerActionTypes.UPDATE_VISUALIZATION_LAYERS;
  constructor(public visualizationLayers: Update<VisualizationLayer>[]) {}
}

export class LoadVisualizationAnalyticsAction implements Action {
  readonly type = VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS;

  constructor(
    public visualizationId: string,
    public visualizationLayers: VisualizationLayer[],
    public globalSelections?: VisualizationDataSelection[]
  ) {}
}

export class LoadVisualizationAnalyticsSuccessAction implements Action {
  readonly type =
    VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_SUCCESS;

  constructor(public id: string, public changes: Partial<VisualizationLayer>) {}
}

export class LoadVisualizationAnalyticsFailAction implements Action {
  readonly type =
    VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_FAIL;

  constructor(public id: string, public error: any) {}
}

export class ReplaceVisualizationLayerIdAction implements Action {
  readonly type = VisualizationLayerActionTypes.ReplaceVisualizationLayerId;
  constructor(public currentId: string, public newId: string) {}
}

export class RemoveVisualizationLayerAction implements Action {
  readonly type = VisualizationLayerActionTypes.RemoveVisualizationLayer;
  constructor(public id: string) {}
}

export type VisualizationLayerAction =
  | AddVisualizationLayerAction
  | UpdateVisualizationLayerAction
  | LoadVisualizationAnalyticsAction
  | LoadVisualizationAnalyticsSuccessAction
  | LoadVisualizationAnalyticsFailAction
  | ReplaceVisualizationLayerIdAction
  | UpdateVisualizationLayersAction
  | RemoveVisualizationLayerAction;
