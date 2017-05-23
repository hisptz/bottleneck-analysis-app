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
export const CURRENT_VISUALIZATION_CHANGE_ACTION = 'CURRENT_VISUALIZATION_CHANGE_ACTION';
export const CHANGE_CURRENT_VISUALIZATION_ACTION = 'CHANGE_CURRENT_VISUALIZATION_ACTION';
export const CHANGE_FILTERS_ACTION = 'CHANGE_FILTERS_ACTION';
export const FILTERS_CHANGE_ACTION = 'FILTERS_CHANGE_ACTION';
export const CHANGE_LAYOUT_ACTION = 'CHANGE_LAYOUT_ACTION';
export const LAYOUT_CHANGE_ACTION = 'LAYOUT_CHANGE_ACTION';
export const ADD_DASHBOARD_ACTION = 'ADD_DASHBOARD_ACTION ';
export const DASHBOARD_ADDED_ACTION = 'DASHBOARD_ADDED_ACTION';
export const DELETE_DASHBOARD_ACTION = 'DELETE_DASHBOARD_ACTION ';
export const DASHBOARD_DELETED_ACTION = 'DASHBOARD_DELETED_ACTION';
export const LAST_DASHBOARD_CHANGE_ACTION = 'LAST_DASHBOARD_CHANGE_ACTION';
export const DELETE_DASHBOARD_ITEM_ACTION = 'DELETE_DASHBOARD_ITEM_ACTION';
export const DASHBOARD_ITEM_DELETED_ACTION = 'DASHBOARD_ITEM_DELETED_ACTION';
export const ADD_DASHBOARD_ITEM_ACTION = 'ADD_DASHBOARD_ITEM_ACTION';
export const DASHBOARD_ITEM_ADDED_ACTION = 'DASHBOARD_ITEM_ADDED_ACTION';
export const ERROR_OCCURRED_ACTION = 'ERROR_OCCURRED_ACTION';


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

export class ChangeCurrentVisualizationAction implements Action {
  readonly type = CHANGE_CURRENT_VISUALIZATION_ACTION;
  constructor(public payload: Visualization) {}
}

export class CurrentVisualizationChangeAction implements Action {
  readonly type = CURRENT_VISUALIZATION_CHANGE_ACTION;
  constructor(public payload: Visualization) {}
}

export class ChangeFiltersAction implements Action {
  readonly type = CHANGE_FILTERS_ACTION;
  constructor(public payload: Visualization) {}
}

export class FiltersChangeAction implements Action {
  readonly type = FILTERS_CHANGE_ACTION;
  constructor(public payload: Visualization) {}
}

export class ChangeLayoutAction implements Action {
  readonly type = CHANGE_LAYOUT_ACTION;
  constructor(public payload: Visualization) {}
}


export class LayoutChangeAction implements Action {
  readonly type = LAYOUT_CHANGE_ACTION;
  constructor(public payload: Visualization) {}
}

export class AddDashboardAction implements Action {
  readonly type = ADD_DASHBOARD_ACTION;
  constructor(public payload: string) {}
}

export class DashboardAddedAction implements Action {
  readonly type = DASHBOARD_ADDED_ACTION;
  constructor(public payload: Dashboard) {}
}

export class DeleteDashboardAction implements Action {
  readonly type = DELETE_DASHBOARD_ACTION;
  constructor(public payload: string) {}
}

export class DashboardDeletedAction implements Action {
  readonly type = DASHBOARD_DELETED_ACTION;
  constructor(public payload: string) {}
}

export class LastDashboardChangeAction implements Action {
  readonly type = LAST_DASHBOARD_CHANGE_ACTION;
  constructor(public payload: string) {}
}

export class DeleteDashboardItemAction implements Action {
  readonly type = DELETE_DASHBOARD_ITEM_ACTION;
  constructor(public payload: any) {}
}

export class DashboardItemDeletedAction implements Action {
  readonly type = DASHBOARD_ITEM_DELETED_ACTION;
  constructor(public payload: any) {}
}

export class AddDashboardItemAction implements Action {
  readonly type = ADD_DASHBOARD_ITEM_ACTION;
  constructor(public payload: any) {}
}

export class DashboardItemAddedAction implements Action {
  readonly type = DASHBOARD_ITEM_ADDED_ACTION;
  constructor(public payload: any) {}
}

export class ErrorOccurredAction implements Action {
  readonly type = ERROR_OCCURRED_ACTION;
  constructor(public payload: string) {}
}
