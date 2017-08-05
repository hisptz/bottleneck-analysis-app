export interface UiState {
  errorMessage: string;
  systemInfo: {
    rootUrl: string;
    apiRootUrl: undefined,
    currentVersion: number;
    maxSupportedVersion: number;
    minSupportedVersion: number;
    loaded: boolean;
  };
  dashboardLoaded: boolean;
  currentDashboard: string;
}

export const INITIAL_UI_STATE = {
  errorMessage: '',
  systemInfo: {
    rootUrl: undefined,
    apiRootUrl: undefined,
    currentVersion: 2.25,
    maxSupportedVersion: 2.25,
    minSupportedVersion: 2.18,
    loaded: false
  },
  currentDashboard: undefined,
  dashboardLoaded: false
};
