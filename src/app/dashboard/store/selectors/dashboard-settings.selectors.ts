import { createSelector } from '@ngrx/store';
import {
  getAllDashboardSettings,
  getDashboardSettingsState,
  getDashboardSettingsLoadedState,
  getDashboardSettingsLoadingState
} from '../reducers/dashboard-settings.reducer';
import { DashboardSettings } from '../../models/dashboard-settings.model';

export const getDashboardSettings = createSelector(
  getAllDashboardSettings,
  (dashboardSettingsList: DashboardSettings[]) => dashboardSettingsList[0]
);

export const getDashboardSettingsLoaded = createSelector(
  getDashboardSettingsState,
  getDashboardSettingsLoadedState
);

export const getDashboardSettingsLoading = createSelector(
  getDashboardSettingsState,
  getDashboardSettingsLoadingState
);
