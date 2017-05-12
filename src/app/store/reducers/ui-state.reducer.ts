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
    default:
      return state;
  }
}
