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
export const LOAD_INITIAL_VISUALIZATION_OBJECTS_ACTION = 'LOAD_INITIAL_VISUALIZATION_OBJECTS_ACTION';
export const INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION = 'INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION';
export const LOAD_VISUALIZATION_OPTIONS_ACTION = 'LOAD_VISUALIZATION_OPTIONS_ACTION';
export const VISUALIZATION_OPTIONS_LOADED_ACTION = 'VISUALIZATION_OPTIONS_LOADED_ACTION';
export const RESIZE_DASHBOARD_ACTION = 'RESIZE_DASHBOARD_ACTION';
export const LOAD_FAVORITE_ACTION = 'LOAD_FAVORITE_ACTION';
export const FAVORITE_LOADED_ACTION = 'FAVORITE_LOADED_ACTION';
export const GET_VISUALIZATION_FILTER_ACTION = 'GET_VISUALIZATION_FILTER_ACTION';
export const UPDATE_VISUALIZATION_WITH_FILTER_ACTION = 'UPDATE_VISUALIZATION_WITH_FILTER_ACTION';
export const UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION = 'UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION';
export const UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION = 'UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION';
export const LOAD_ANALYTICS_ACTION = 'LOAD_ANALYTICS_ACTION';
export const ANALYTICS_LOADED_ACTION = 'ANALYTICS_LOADED_ACTION';
export const SAVE_CHART_CONFIGURATION_ACTION = 'SAVE_CHART_CONFIGURATION_ACTION';
export const SAVE_TABLE_CONFIGURATION_ACTION = 'SAVE_TABLE_CONFIGURATION_ACTION';
export const SAVE_MAP_CONFIGURATION_ACTION = 'SAVE_MAP_CONFIGURATION_ACTION';
export const SAVE_CHART_OBJECT_ACTION = 'SAVE_CHART_OBJECT_ACTION';
export const SAVE_TABLE_OBJECT_ACTION = 'SAVE_TABLE_OBJECT_ACTION';
export const LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION = 'LOAD_FAVORITE_ADDITIONAL_OPTION_ACTION';
export const FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION = 'FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION';
export const GEO_FEATURE_LOADED_ACTION = 'GEO_FEATURE_LOADED_ACTION';
export const LEGEND_SET_LOADED_ACTION = 'LEGEND_SET_LOADED_ACTION';
export const SAVE_FAVORITE_ACTION = 'SAVE_FAVORITE_ACTION';
export const FAVORITE_SAVED_ACTION = 'FAVORITE_SAVED_ACTION';
export const GLOBAL_FILTER_UPDATE_ACTION = 'GLOBAL_FILTER_UPDATE_ACTION';
export const FULL_SCREEN_TOGGLE_ACTION = 'FULL_SCREEN_TOGGLE_ACTION';
export const LOAD_FAVORITE_OPTIONS_ACTION = 'LOAD_FAVORITE_OPTIONS_ACTION';
export const FAVORITE_OPTIONS_LOADED_ACTION = 'FAVORITE_OPTIONS_LOADED_ACTION';
export const LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION = 'LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION';
export const DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION = 'DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION';
export const DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION = 'DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION';
export const DASHBOARD_GROUP_SETTINGS_UPDATED_ACTION = 'DASHBOARD_GROUP_SETTINGS_UPDATED_ACTION';
export const CURRENT_VISUALIZATION_CHANGE_ACTION = 'CURRENT_VISUALIZATION_CHANGE_ACTION';
export const SPLIT_VISUALIZATION_OBJECT_ACTION = 'SPLIT_VISUALIZATION_OBJECT_ACTION';
export const MERGE_VISUALIZATION_OBJECT_ACTION = 'MERGE_VISUALIZATION_OBJECT_ACTION';
export const VISUALIZATION_OBJECT_SPLITED_ACTION = 'VISUALIZATION_OBJECT_SPLITED_ACTION';
export const VISUALIZATION_OBJECT_MERGED_ACTION = 'VISUALIZATION_OBJECT_MERGED_ACTION';
export const LOAD_DASHBOARD_SEARCH_ITEMS_ACTION = 'LOAD_DASHBOARD_SEARCH_ITEMS_ACTION';
export const DASHBOARD_SEARCH_ITEMS_LOADED_ACTION = 'DASHBOARD_SEARCH_ITEMS_LOADED_ACTION';
export const DASHBOARD_ITEM_SEARCH_ACTION = 'DASHBOARD_ITEM_SEARCH_ACTION';
export const DASHBOARD_ITEM_ADD_ACTION = 'DASHBOARD_ITEM_ADD_ACTION';
export const DASHBOARD_ITEM_ADDED_ACTION = 'DASHBOARD_ITEM_ADDED_ACTION';
export const DELETE_VISUALIZATION_OBJECT_ACTION = 'DELETE_VISUALIZATION_OBJECT_ACTION';
export const VISUALIZATION_OBJECT_DELETED_ACTION = 'VISUALIZATION_OBJECT_DELETED_ACTION';
export const NAVIGATE_DASHBOARD_ACTION = 'NAVIGATE_DASHBOARD_ACTION';
export const DASHBOARD_NAVIGATED_ACTION = 'DASHBOARD_NAVIGATED_ACTION';
export const DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION = 'DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION';
export const VISUALIZATION_OBJECT_OPTIMIZED_ACTION = 'VISUALIZATION_OBJECT_OPTIMIZED_ACTION';
export const HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON = 'HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON';
export const UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION = 'UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION';
export const VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION = 'VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION';
export const CURRENT_DASHBOARD_SAVE_ACTION = 'CURRENT_DASHBOARD_SAVE_ACTION';
export const UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION = 'UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION';
export const LOAD_CURRENT_DASHBOARD = 'LOAD_CURRENT_DASHBOARD';
export const CURRENT_DASHBOARD_LOADED = 'CURRENT_DASHBOARD_LOADED';
export const DASHBOARD_NAVIGATION_ACTION = 'DASHBOARD_NAVIGATION_ACTION';
export const UPDATE_VISUALIZATION_WITH_MAP_SETTINGS = 'UPDATE_VISUALIZATION_WITH_MAP_SETTINGS';
export const VISUALIZATION_WITH_MAP_SETTINGS_UPDATED = 'VISUALIZATION_WITH_MAP_SETTINGS_UPDATED';
export const SAVE_VISUALIZATION = 'SAVE_VISUALIZATION';
export const GLOBAL_FILTER_CHANGE_ACTION = 'GLOBAL_FILTER_CHANGE_ACTION';
export const LOCAL_FILTER_CHANGE_ACTION = 'LOCAL_FILTER_CHANGE_ACTION';

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
  constructor(public payload: Dashboard[]) {}
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

export class InitialVisualizationObjectsLoadedAction implements Action {
  readonly type = INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION;
  constructor(public payload: Visualization[]) {}
}

export class LoadFavoriteAction implements Action {
  readonly type = LOAD_FAVORITE_ACTION;
  constructor(public payload: any) {}
}

export class FavoriteLoadedAction implements Action {
  readonly type = FAVORITE_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class ResizeDashboardAction implements Action {
  readonly type = RESIZE_DASHBOARD_ACTION;
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

export class FavoriteAdditionalOptionsLoadedAction implements Action {
  readonly type = FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION;
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

export class FullScreenToggleAction implements Action {
  readonly type = FULL_SCREEN_TOGGLE_ACTION;
  constructor(public payload: any) {}
}

export class LoadFavoriteOptionsAction implements Action {
  readonly type = LOAD_FAVORITE_OPTIONS_ACTION;
  constructor(public payload: any) {}
}

export class FavoriteOptionsLoadedAction implements Action {
  readonly type = FAVORITE_OPTIONS_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class LoadDashboardsCustomSettingsAction implements Action {
  readonly type = LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION;
  constructor(public payload: any) {}
}

export class DashboardsCustomSettingsLoadedAction implements Action {
  readonly type = DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION;
  constructor(public payload: any) {}
}

export class DashboardGroupSettingsUpdateAction implements Action {
  readonly type = DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION;
  constructor(public payload: any) {}
}

export class DashboardGroupSettingsUpdatedAction implements Action {
  readonly type = DASHBOARD_GROUP_SETTINGS_UPDATED_ACTION;
  constructor(public payload: any) {}
}

export class CurrentVisualizationChangeAction implements Action {
  readonly type = CURRENT_VISUALIZATION_CHANGE_ACTION;
  constructor(public payload: any) {}
}

export class VisualizationObjectSplitedAction implements Action {
  readonly type = VISUALIZATION_OBJECT_SPLITED_ACTION;

  constructor(public payload: any) {}
}

export class VisualizationObjectMergedAction implements Action {
  readonly type = VISUALIZATION_OBJECT_MERGED_ACTION;

  constructor(public payload: any) {}
}

export class LoadDashboardSearchItemsAction implements Action {
  readonly type = LOAD_DASHBOARD_SEARCH_ITEMS_ACTION;

  constructor(public payload: any) {}
}

export class DashboardSearchItemsLoadedAction implements Action {
  readonly type = DASHBOARD_SEARCH_ITEMS_LOADED_ACTION;

  constructor(public payload: any) {}
}

export class DashboardItemSearchAction implements Action {
  readonly type = DASHBOARD_ITEM_SEARCH_ACTION;

  constructor(public payload: string) {}
}

export class DashboardItemAddAction implements Action {
  readonly type = DASHBOARD_ITEM_ADD_ACTION;

  constructor(public payload: any) {}
}

export class DashboardItemAddedAction implements Action {
  readonly type = DASHBOARD_ITEM_ADDED_ACTION;

  constructor(public payload: any) {}
}

export class DeleteVisualizationObjectAction implements Action {
  readonly type = DELETE_VISUALIZATION_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class VisualizationObjectDeletedAction implements Action {
  readonly type = VISUALIZATION_OBJECT_DELETED_ACTION;
  constructor(public payload: any) {}
}

export class NavigateDashboardAction implements Action {
  readonly type = NAVIGATE_DASHBOARD_ACTION;
  constructor(public payload: any) {}
}

export class DashboardNavigatedAction implements Action {
  readonly type = DASHBOARD_NAVIGATED_ACTION;
  constructor(public payload: any) {}
}

export class DashboardSearchHeaderChangeAction implements Action {
  readonly type = DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION;
  constructor(public payload: any) {}
}

export class HideDashboardMenuNotificationIcon implements Action {
  readonly type = HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON;
  constructor(public payload: any) {}
}

export class UpdateVisualizationObjectWithRenderingObjectAction implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION;
  constructor(public payload: any) {}
}

export class VisualizationObjectLayoutChangeAction implements Action {
  readonly type = VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION;
  constructor(public payload: any) {}
}

export class CurrentDashboardSaveAction implements Action {
  readonly type = CURRENT_DASHBOARD_SAVE_ACTION;
  constructor(public payload: any) {}
}

export class UpdateVisualizationWithInterpretationAction implements Action {
  readonly type = UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION;
  constructor(public payload: any) {}
}

export class LoadCurrentDashboard implements Action {
  readonly type = LOAD_CURRENT_DASHBOARD;
}

export class CurrentDashboardLoaded implements Action {
  readonly type = CURRENT_DASHBOARD_LOADED;
  constructor(public payload: Dashboard) {}
}

export class DashboardNavigationAction implements Action {
  readonly type = DASHBOARD_NAVIGATION_ACTION;
}

export class UpdateVisualizationWithMapSettings implements Action {
  readonly type = UPDATE_VISUALIZATION_WITH_MAP_SETTINGS;
  constructor(public payload: Visualization) {}
}

export class SaveVisualization implements Action {
  readonly type = SAVE_VISUALIZATION;
  constructor(public payload: Visualization) {}
}

export class GlobalFilterChangeAction implements Action {
  readonly type = GLOBAL_FILTER_CHANGE_ACTION;
  constructor(public payload: any) {}
}
