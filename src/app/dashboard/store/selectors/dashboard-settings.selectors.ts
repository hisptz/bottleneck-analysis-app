import { createSelector } from '@ngrx/store';
import * as fromDashboardSettingsReducer from '../reducers/dashboard-settings.reducer';
import { DashboardSettings } from '../../models/dashboard-settings.model';

export const getDashboardSettings = createSelector(
  fromDashboardSettingsReducer.getAllDashboardSettings,
  (dashboardSettingsList: DashboardSettings[]) => dashboardSettingsList[0]
);

export const getDashboardSettingsLoaded = createSelector(
  fromDashboardSettingsReducer.getDashboardSettingsState,
  (state: fromDashboardSettingsReducer.State) => state.loaded
);

export const getDashboardSettingsLoading = createSelector(
  fromDashboardSettingsReducer.getDashboardSettingsState,
  (state: fromDashboardSettingsReducer.State) => state.loading
);
