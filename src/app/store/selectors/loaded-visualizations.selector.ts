import {ApplicationState} from "../application-state";
export function loadedVisualizationSelector(state: ApplicationState) {
  return state.uiState.visualizationObjectsLoaded;
}
