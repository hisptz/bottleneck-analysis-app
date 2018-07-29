import { createSelector } from '@ngrx/store';
import { DashboardState, getDashboardState } from '../reducers';
import { getAllDashboardSettingsState } from '../reducers/dashboard-settings.reducer';
import { DashboardSettings } from '../../models/dashboard-settings.model';
export const getDashboardSettingsState = createSelector(
  getDashboardState,
  (state: DashboardState) => state.dashboardSettings
);

export const getAllDashboardSettings = createSelector(
  getDashboardSettingsState,
  getAllDashboardSettingsState
);

export const getDashboardSettings = createSelector(
  getAllDashboardSettings,
  (dashboardSettingsList: DashboardSettings[]) => dashboardSettingsList[0]
);
