import {CurrentUser} from "../model/current-user";
import {Action} from "@ngrx/store";
import {Dashboard} from "../model/dashboard";
import {Visualization} from "../model/visualization";
export const LOAD_CURRENT_USER_ACTION = 'LOAD_CURRENT_USER_ACTION';
export const LOAD_DASHBOARDS_ACTION = 'LOAD_DASHBOARDS_ACTION';
export const CURRENT_USER_LOADED_ACTION = 'CURRENT_USER_LOADED_ACTION';
export const DASHBOARDS_LOADED_ACTION = 'DASHBOARDS_LOADED_ACTION';
export const CURRENT_DASHBOARD_CHANGE_ACTION = 'CURRENT_DASHBOARD_CHANGE_ACTION';
export const UPDATE_DASHBOARD_ACTION = 'UPDATE_DASHBOARD_ACTION';
export const DASHBOARD_UPDATED_ACTION = 'DASHBOARD_UPDATED_ACTION';
export const LOAD_FAVORITE_ACTION = 'LOAD_FAVORITE_ACTION';
export const FAVORITE_LOADED_ACTION = 'FAVORITE_LOADED_ACTION';
export const LOAD_VISUALIZATION_OBJECT_ACTION = 'LOAD_VISUALIZATION_OBJECT_ACTION';
export const UPDATE_VISUALIZATION_OBJECT_ACTION = 'UPDATE_VISUALIZATION_OBJECT_ACTION';
export const VISUALIZATION_OBJECT_LOADED_ACTION = 'VISUALIZATION_OBJECT_LOADED_ACTION';
export const LOAD_ANALYTICS_ACTION = 'LOAD_ANALYTICS_ACTION';
export const ANALYTICS_LOADED_ACTION = 'ANALYTICS_LOADED_ACTION';




export class LoadCurrentUserAction implements Action {
  readonly type = LOAD_CURRENT_USER_ACTION;
}

export class CurrentUserLoadedAction implements Action {
  readonly type = CURRENT_USER_LOADED_ACTION;
  constructor(public payload: CurrentUser) {}
}

export class LoadDashboardsAction implements Action {
  readonly type = LOAD_DASHBOARDS_ACTION;
}

export class DashboardsLoadedAction implements Action {
  readonly type = DASHBOARDS_LOADED_ACTION;
  constructor(public payload: Dashboard) {}
}

export class CurrentDashboardChangeAction implements Action {
  readonly type = CURRENT_DASHBOARD_CHANGE_ACTION;
  constructor(public payload: string) {}
}

export class UpdateDashboardAction implements Action {
  readonly type = UPDATE_DASHBOARD_ACTION;
  constructor(public payload: any) {}
}

export class DashboardUpdatedAction implements Action {
  readonly type = DASHBOARD_UPDATED_ACTION;
  constructor(public payload: any) {}
}

export class LoadVisualizationObjectAction implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT_ACTION;
  constructor(public payload: Visualization) {}
}

export class VisualizationObjectLoadedAction implements Action {
  readonly type = VISUALIZATION_OBJECT_LOADED_ACTION;
  constructor(public payload: Visualization) {}
}

