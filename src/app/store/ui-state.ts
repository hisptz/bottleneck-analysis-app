export interface UiState {
  errorMessage: string;
  systemInfo: {
    rootUrl: string;
    currentVersion: number;
    maxSupportedVersion: number;
    minSupportedVersion: number;
    loaded: boolean;
  };
  currentDashboard: string;
}

export const INITIAL_UI_STATE = {
  errorMessage: '',
  systemInfo: {
    rootUrl: undefined,
    currentVersion: 2.25,
    maxSupportedVersion: 2.25,
    minSupportedVersion: 2.23,
    loaded: false
  },
  currentDashboard: undefined
};
