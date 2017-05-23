import {UiState, INITIAL_UI_STATE} from "../ui-state";
import * as _ from 'lodash';
export function uiStateReducer(state: UiState = INITIAL_UI_STATE, action) {
  switch (action.type) {
    case 'CURRENT_DASHBOARD_CHANGE_ACTION': {
      const newState: UiState = _.clone(state);
      newState.currentDashboard = action.payload;
      return newState;
    }

    case 'VISUALIZATION_OBJECT_LOADED_ACTION': {
      const newState: UiState = _.clone(state);
      state.visualizationObjectsLoaded = [...state.visualizationObjectsLoaded, action.payload.id];
      return state;
    }

    case 'ADD_DASHBOARD_ACTION': {
      const newState: UiState = _.clone(state);
      newState.currentCreatedDashboard = null;
      return newState;
    }

    case 'DASHBOARD_ADDED_ACTION': {
      const newState: UiState = _.clone(state);
      newState.currentCreatedDashboard = action.payload.id;
      return newState;
    }

    case 'DASHBOARD_DELETED_ACTION': {
      const newState: UiState = _.clone(state);
      newState.currentDeletedDashboard = action.payload;
      if(newState.currentDashboard == action.payload) {
        newState.currentDashboard = undefined;
      }

      return state;
    }

    case 'ERROR_OCCURRED_ACTION': {
      const newState: UiState = _.clone(state);
      newState.errorMessage = action.payload;
      return newState;
    }

    default:
      return state;
  }
}
