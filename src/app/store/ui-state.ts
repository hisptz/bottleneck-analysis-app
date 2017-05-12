export interface UiState {
  currentDashboard: string;
  visualizationObjectsLoaded: Array<string>;
}

export const INITIAL_UI_STATE = {
  currentDashboard: undefined,
  visualizationObjectsLoaded: []
};
