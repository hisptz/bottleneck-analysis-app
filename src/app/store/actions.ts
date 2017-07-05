import {Action} from '@ngrx/store';
import {Dashboard} from '../model/dashboard';
import {CurrentUser} from '../model/current-user';
import {SystemInfo} from '../providers/system-info.service';
import {Visualization} from '../dashboard/model/visualization';
export const LOAD_SYSTEM_INFO_ACTION = 'LOAD_SYSTEM_INFO_ACTION';
export const SYSTEM_INFO_LOADED_ACTION = 'SYSTEM_INFO_LOADED_ACTION';
export const ERROR_OCCURRED_ACTION = 'ERROR_OCCURRED_ACTION';
export const CLEAR_MESSAGE_ACTION = 'CLEAR_MESSAGE_ACTION';
export const LOAD_CURRENT_USER_ACTION = 'LOAD_CURRENT_USER_ACTION';
export const LOAD_DASHBOARDS_ACTION = 'LOAD_DASHBOARDS_ACTION';
export const CURRENT_USER_LOADED_ACTION = 'CURRENT_USER_LOADED_ACTION';
export const DASHBOARDS_LOADED_ACTION = 'DASHBOARDS_LOADED_ACTION';
export const CURRENT_DASHBOARD_CHANGE_ACTION = 'CURRENT_DASHBOARD_CHANGE_ACTION';
export const LOAD_DASHBOARD_NOTIFICATION_ACTION = 'LOAD_DASHBOARD_NOTIFICATION_ACTION';
export const DASHBOARD_NOTIFICATION_LOADED_ACTION = 'DASHBOARD_NOTIFICATION_LOADED_ACTION';
export const CREATE_DASHBOARD_ACTION = 'CREATE_DASHBOARD_ACTION';
export const EDIT_DASHBOARD_ACTION = 'EDIT_DASHBOARD_ACTION';
export const DASHBOARD_CREATED_ACTION = 'DASHBOARD_CREATED_ACTION';
export const DASHBOARD_EDITED_ACTION = 'DASHBOARD_EDITED_ACTION';
export const DELETE_DASHBOARD_ACTION = 'DELETE_DASHBOARD_ACTION';
export const DASHBOARD_DELETED_ACTION = 'DASHBOARD_DELETED_ACTION';
export const LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION = 'LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION';
export const INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION = 'INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION';
export const LOAD_VISUALIZATION_OPTIONS_ACTION = 'LOAD_VISUALIZATION_OPTIONS_ACTION';
export const VISUALIZATION_OPTIONS_LOADED_ACTION = 'VISUALIZATION_OPTIONS_LOADED_ACTION';
export const RESIZE_DASHBOARD_ACTION = 'RESIZE_DASHBOARD_ACTION';
export const DASHBOARD_RESIZED_ACTION = 'DASHBOARD_RESIZED_ACTION';
export const LOAD_FAVORITE_ACTION = 'LOAD_FAVORITE_ACTION';
export const FAVORITE_LOADED_ACTION = 'FAVORITE_LOADED_ACTION';
export const GET_VISUALIZATION_FILTER_ACTION = 'GET_VISUALIZATION_FILTER_ACTION';
export const UPDATE_VISUALIZATION_WITH_FILTER_ACTION = 'UPDATE_VISUALIZATION_WITH_FILTER_ACTION';
export const UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION = 'UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION';
export const GET_VISUALIZATION_LAYOUT_ACTION = 'GET_VISUALIZATION_LAYOUT_ACTION';
export const UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION = 'UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION';
export const LOAD_ANALYTICS_ACTION = 'LOAD_ANALYTICS_ACTION';
export const ANALYTICS_LOADED_ACTION = 'ANALYTICS_LOADED_ACTION';
export const GET_CHART_CONFIGURATION_ACTION = 'GET_CHART_CONFIGURATION_ACTION';
export const GET_MAP_CONFIGURATION_ACTION = 'GET_MAP_CONFIGURATION_ACTION';
export const GET_CHART_OBJECT_ACTION = 'GET_CHART_OBJECT_ACTION';
export const GET_MAP_OBJECT_ACTION = 'GET_MAP_OBJECT_ACTION';
export const SAVE_CHART_CONFIGURATION_ACTION = 'SAVE_CHART_CONFIGURATION_ACTION';
export const SAVE_MAP_CONFIGURATION_ACTION = 'SAVE_MAP_CONFIGURATION_ACTION';
export const SAVE_CHART_OBJECT_ACTION = 'SAVE_CHART_OBJECT_ACTION';
export const SAVE_MAP_OBJECT_ACTION = 'SAVE_MAP_OBJECT_ACTION';
export const LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION = 'LOAD_FAVORITE_ADDITIONAL_OPTION_ACTION';
export const FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION = 'FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION';
export const UPDATE_FAVORITE_OPTIONS_ACTION = 'UPDATE_FAVORITE_OPTIONS_ACTION';
export const UPDATE_FAVORITE_ACTION = 'UPDATE_FAVORITE_ACTION';
export const LOAD_GEO_FEATURE_ACTION = 'LOAD_GEO_FEATURE_ACTION';
export const GEO_FEATURE_LOADED_ACTION = 'GEO_FEATURE_LOADED_ACTION';
export const LOAD_LEGEND_SET_ACTION = 'LOAD_LEGEND_SET_ACTION';
export const LEGEND_SET_LOADED_ACTION = 'LEGEND_SET_LOADED_ACTION';
export const LOAD_ORGUNIT_GROUP_SET_ACTION = 'LOAD_ORGUNIT_GROUP_SET_ACTION';
export const ORGUNIT_GROUP_SET_LOADED_ACTION = 'ORGUNIT_GROUP_SET_LOADED_ACTION';
export const SAVE_FAVORITE_ACTION = 'SAVE_FAVORITE_ACTION';
export const FAVORITE_SAVED_ACTION = 'FAVORITE_SAVED_ACTION';
export const GLOBAL_FILTER_UPDATE_ACTION = 'GLOBAL_FILTER_UPDATE_ACTION';

export class LoadSystemInfoAction implements Action {
  readonly type = LOAD_SYSTEM_INFO_ACTION;
}

export class SystemInfoLoadedAction implements Action {
  readonly type = SYSTEM_INFO_LOADED_ACTION;
  constructor (public payload: SystemInfo) {}
}

export class ErrorOccurredAction implements Action {
  readonly type = ERROR_OCCURRED_ACTION;
  constructor(public payload: string) {}
}

export class ClearMessageAction implements  Action{
  readonly type = CLEAR_MESSAGE_ACTION;
}

export class LoadCurrentUserAction implements Action {
  readonly type = LOAD_CURRENT_USER_ACTION;
  constructor (public payload: string) {}
}

export class CurrentUserLoadedAction implements Action {
  readonly type = CURRENT_USER_LOADED_ACTION;
  constructor(public payload: CurrentUser) {}
}

export class LoadDashboardsAction implements Action {
  readonly type = LOAD_DASHBOARDS_ACTION;
  constructor (public payload: string) {}
}

export class DashboardsLoadedAction implements Action {
  readonly type = DASHBOARDS_LOADED_ACTION;
  constructor(public payload: Dashboard) {}
}

export class CurrentDashboardChangeAction implements Action {
  readonly type = CURRENT_DASHBOARD_CHANGE_ACTION;
  constructor(public payload: string) {}
}

export class LoadDashboardNotificationAction implements Action {
  readonly type = LOAD_DASHBOARD_NOTIFICATION_ACTION;
  constructor (public payload: string) {}
}

export class DashboardNotificationLoadedAction implements Action {
  readonly type = DASHBOARD_NOTIFICATION_LOADED_ACTION;
  constructor (public payload: string) {}
}

export class CreateDashboardAction implements Action {
  readonly type = CREATE_DASHBOARD_ACTION;
  constructor (public payload: any) {}
}

export class DashboardCreatedAction implements Action {
  readonly type = DASHBOARD_CREATED_ACTION;
  constructor (public payload: any) {}
}

export class EditDashboardAction implements Action {
  readonly type = EDIT_DASHBOARD_ACTION;
  constructor (public payload: any) {}
}

export class DashboardEditedAction implements Action {
  readonly type = DASHBOARD_EDITED_ACTION;
  constructor (public payload: any) {}
}

export class DeleteDashboardAction implements Action {
  readonly type = DELETE_DASHBOARD_ACTION;
  constructor (public payload: any) {}
}

export class DashboardDeletedAction implements Action {
  readonly type = DASHBOARD_DELETED_ACTION;
  constructor (public payload: any) {}
}

export class LoadInitialVisualizationObjectAction implements Action {
  readonly type = LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class InitialVisualizationObjectLoadedAction implements Action {
  readonly type = INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class LoadVisualizationOptionsAction implements Action {
  readonly type = LOAD_VISUALIZATION_OPTIONS_ACTION;
  constructor(public payload: Visualization) {}
}

export class VisualizationOptionsLoadedAction implements Action {
  readonly type = VISUALIZATION_OPTIONS_LOADED_ACTION;
  constructor(public payload: Visualization) {}
}

export class LoadFavoriteAction implements Action {
  readonly type = LOAD_FAVORITE_ACTION;
  constructor(public payload: Visualization) {}
}

export class FavoriteLoadedAction implements Action {
  readonly type = FAVORITE_LOADED_ACTION;
  constructor(public payload: Visualization) {}
}

export class ResizeDashboardAction implements Action {
  readonly type = RESIZE_DASHBOARD_ACTION;
  constructor(public payload: any) {}
}

export class DashboardRezisedAction implements Action {
  readonly type = DASHBOARD_RESIZED_ACTION;
}

export class GetVisualizationFilterAction implements Action {
  readonly type = GET_VISUALIZATION_FILTER_ACTION;
  constructor(public payload: any) {}
}

export class UpdateVisualizationWithFilterAction implements Action {
  readonly type = UPDATE_VISUALIZATION_WITH_FILTER_ACTION;
  constructor(public payload: any) {}
}

export class UpdateVisualizationWithCustomFilterAction implements Action {
  readonly type = UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION;
  constructor(public payload: any) {}
}

export class GetVisualizationLayoutAction implements Action {
  readonly type = GET_VISUALIZATION_LAYOUT_ACTION;
  constructor(public payload: any) {}
}

export class UpdateVisualizationWithLayoutAction implements Action {
  readonly type = UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION;
  constructor(public payload: any) {}
}

export class LoadAnalyticsAction implements Action {
  readonly type = LOAD_ANALYTICS_ACTION;
  constructor(public payload: any) {}
}

export class AnalyticsLoadedAction implements Action {
  readonly type = ANALYTICS_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class GetChartConfigurationAction implements Action {
  readonly type = GET_CHART_CONFIGURATION_ACTION;
  constructor(public payload: any) {}
}

export class GetMapConfigurationAction implements Action {
  readonly type = GET_MAP_CONFIGURATION_ACTION;
  constructor(public payload: any) {}
}

export class SaveChartConfigurationAction implements Action {
  readonly type = SAVE_CHART_CONFIGURATION_ACTION;
  constructor(public payload: any) {}
}

export class SaveMapConfigurationAction implements Action {
  readonly type = SAVE_MAP_CONFIGURATION_ACTION;
  constructor(public payload: any) {}
}


export class GetChartObjectAction implements Action {
  readonly type = GET_CHART_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class SaveChartObjectAction implements Action {
  readonly type = SAVE_CHART_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class GetMapObjectAction implements Action {
  readonly type = GET_MAP_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class SaveMapObjectAction implements Action {
  readonly type = SAVE_MAP_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class LoadFavoriteAdditionalOptionAction implements Action {
  readonly type = LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION;
  constructor(public payload: any) {}
}

export class FavoriteAdditionalOptionsLoadedAction implements Action {
  readonly type = FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class UpdateFavoriteOptionsAction implements Action {
  readonly type = UPDATE_FAVORITE_OPTIONS_ACTION;
  constructor(public payload: any) {}
}

export class LoadGeoFeatureAction implements Action {
  readonly type = LOAD_GEO_FEATURE_ACTION;
  constructor(public payload: any) {}
}

export class GeoFeatureLoadedAction implements Action {
  readonly type = GEO_FEATURE_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class LoadLegendSetAction implements Action {
  readonly type = LOAD_LEGEND_SET_ACTION;
  constructor(public payload: any) {}
}

export class LegendSetLoadedAction implements Action {
  readonly type = LEGEND_SET_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class LoadOrgUnitGroupSetAction implements Action {
  readonly type = LOAD_ORGUNIT_GROUP_SET_ACTION;
  constructor(public payload: any) {}
}

export class OrgUnitGroupSetLoadedAction implements Action {
  readonly type = ORGUNIT_GROUP_SET_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class SaveFavoriteAction implements Action {
  readonly type = SAVE_FAVORITE_ACTION;
  constructor(public payload: any) {}
}

export class FavoritesSavedAction implements Action {
  readonly type = FAVORITE_SAVED_ACTION;
  constructor(public payload: any) {}
}

export class GlobalFilterUpdateAction implements Action {
  readonly type = GLOBAL_FILTER_UPDATE_ACTION;
  constructor(public payload: any) {}
}
