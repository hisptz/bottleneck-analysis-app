import { Action } from '@ngrx/store';
import { Visualization, VisualizationLayer } from '../../models';

export enum VisualizationObjectActionTypes {
  AddVisualizationObjects = '[Visualization] Add all visualization objects',
  ADD_VISUALIZATION_OBJECT = '[Visualization] Add visualization object',
  INITIALIZE_VISUALIZATION_OBJECT = '[Visualization] Initialize visualization object',
  UPDATE_VISUALIZATION_OBJECT = '[Visualization] Update visualization object',
  LOAD_VISUALIZATION_FAVORITE = '[Visualization] Load visualization favorite',
  LOAD_VISUALIZATION_FAVORITE_SUCCESS = '[Visualization] Load visualization favorite success',
  LOAD_VISUALIZATION_FAVORITE_FAIL = '[Visualization] Load visualization favorite fail',
  SaveVisualizationFavorite = '[Visualization] Save visualization favorite',
  RemoveVisualizationFavorite = '[Visualization] Remove visualization favorite',
  RemoveVisualizationObject = '[Visualization] Remove visualization object'
}

export class AddVisualizationObjectAction implements Action {
  readonly type = VisualizationObjectActionTypes.ADD_VISUALIZATION_OBJECT;

  constructor(public visualizationObject: Visualization) {}
}

export class AddVisualizationObjectsAction implements Action {
  readonly type = VisualizationObjectActionTypes.AddVisualizationObjects;

  constructor(public visualizationObjects: Visualization[]) {}
}

export class InitializeVisualizationObjectAction implements Action {
  readonly type =
    VisualizationObjectActionTypes.INITIALIZE_VISUALIZATION_OBJECT;

  constructor(
    public id: string,
    public name: string,
    public visualizationType: string,
    public visualizationLayers: VisualizationLayer[],
    public currentUser: any,
    public systemInfo: any
  ) {}
}

export class UpdateVisualizationObjectAction implements Action {
  readonly type = VisualizationObjectActionTypes.UPDATE_VISUALIZATION_OBJECT;

  constructor(public id: string, public changes: Partial<Visualization>) {}
}

export class LoadVisualizationFavoriteAction implements Action {
  readonly type = VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE;

  constructor(
    public visualization: Visualization,
    public currentUser: any,
    public systemInfo: any
  ) {}
}

export class LoadVisualizationFavoriteSuccessAction implements Action {
  readonly type =
    VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE_SUCCESS;

  constructor(
    public visualization: Visualization,
    public favorite: any,
    public currentUser: any,
    public systemInfo: any
  ) {}
}

export class LoadVisualizationFavoriteFailAction implements Action {
  readonly type =
    VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE_FAIL;

  constructor(public id: string, public error: any) {}
}

export class SaveVisualizationFavoriteAction implements Action {
  readonly type = VisualizationObjectActionTypes.SaveVisualizationFavorite;
  constructor(
    public id: string,
    public favoriteDetails: any,
    public dashboardId: string
  ) {}
}

export class RemoveVisualizationObjectAction implements Action {
  readonly type = VisualizationObjectActionTypes.RemoveVisualizationObject;
  constructor(public id: string, public options?: any) {}
}

export class RemoveVisualizationFavoriteAction implements Action {
  readonly type = VisualizationObjectActionTypes.RemoveVisualizationFavorite;
  constructor(
    public visualizationId: string,
    public favoriteId: string,
    public favoriteType: string
  ) {}
}

export type VisualizationObjectAction =
  | AddVisualizationObjectAction
  | AddVisualizationObjectsAction
  | SaveVisualizationFavoriteAction
  | LoadVisualizationFavoriteAction
  | LoadVisualizationFavoriteSuccessAction
  | LoadVisualizationFavoriteFailAction
  | InitializeVisualizationObjectAction
  | UpdateVisualizationObjectAction
  | RemoveVisualizationObjectAction
  | RemoveVisualizationFavoriteAction;
