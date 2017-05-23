export interface UiState {
  currentDashboard: string;
  currentCreatedDashboard: string;
  currentDeletedDashboard: string;
  visualizationObjectsLoaded: Array<string>;
  errorMessage: string;
}

export const INITIAL_UI_STATE = {
  currentDashboard: undefined,
  currentCreatedDashboard: null,
  currentDeletedDashboard: null,
  visualizationObjectsLoaded: [],
  errorMessage: ''
};
