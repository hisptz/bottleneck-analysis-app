import {UiState, INITIAL_UI_STATE} from "../ui-state";
export function uiStateReducer(state: UiState = INITIAL_UI_STATE, action) {
  switch (action.type) {
    case 'CURRENT_DASHBOARD_CHANGE_ACTION': {
      state.currentDashboard = action.payload;
      return state;
    }

    case 'VISUALIZATION_OBJECT_LOADED_ACTION': {
      state.visualizationObjectsLoaded = [...state.visualizationObjectsLoaded, action.payload.id];
      return state;
    }

    case 'ADD_DASHBOARD_ACTION': {
      state.currentCreatedDashboard = null;
      return state;
    }

    case 'DASHBOARD_ADDED_ACTION': {
      state.currentCreatedDashboard = action.payload.id;
      return state;
    }

    case 'DASHBOARD_DELETED_ACTION': {
      state.currentDeletedDashboard = action.payload;
      if(state.currentDashboard == action.payload) {
        state.currentDashboard = undefined;
      }

      return state;
    }
    default:
      return state;
  }
}
