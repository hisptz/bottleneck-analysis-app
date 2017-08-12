import * as _ from 'lodash';
import {INITIAL_UI_STATE, UiState} from '../ui-state';
import {
  CURRENT_DASHBOARD_CHANGE_ACTION, CURRENT_DASHBOARD_SAVE_ACTION, DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION,
  DASHBOARDS_LOADED_ACTION, FAVORITE_OPTIONS_LOADED_ACTION
} from '../actions';
export function uiStateReducer(state: UiState = INITIAL_UI_STATE, action) {
  switch (action.type) {

    case 'ERROR_OCCURRED_ACTION': {
      const newState: UiState = _.clone(state);
      newState.errorMessage = action.payload;

      /**
       * Also stop dashboard loading if applicable
       */
      newState.dashboardLoaded = true;
      return newState;
    }

    case 'CLEAR_MESSAGE_ACTION': {
      const newState: UiState = _.clone(state);
      newState.errorMessage = '';
      return newState;
    }

    case 'SYSTEM_INFO_LOADED_ACTION': {
      const newState: UiState = _.clone(state);
      const newSystemInfo = _.clone(newState.systemInfo);
      newSystemInfo.rootUrl = action.payload.rootUrl;
      newSystemInfo.apiRootUrl = action.payload.apiRootUrl;
      newSystemInfo.currentVersion = action.payload.currentVersion;
      newSystemInfo.loaded = true;
      newState.systemInfo = newSystemInfo;
      return newState;
    }

    case CURRENT_DASHBOARD_SAVE_ACTION: {
      const newState: UiState = _.clone(state);
      newState.currentDashboard = action.payload;
      return newState;
    }

    case DASHBOARDS_LOADED_ACTION: {
      const newState: UiState = _.clone(state);
      newState.dashboardLoaded = true;
      return newState;
    }

    case DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION: {
      const newState: UiState = _.clone(state);
      newState.dashboardCustomSettingsLoaded = true;
      return newState;
    }

    case FAVORITE_OPTIONS_LOADED_ACTION: {
      const newState: UiState = _.clone(state);
      newState.favoriteOptionsLoaded = true;
      return newState;
    }

    default:
      return state;
  }
}
