import { createSelector } from '@ngrx/store';
import {
  getAllDashboardSettingsState,
  getDashboardSettingsLoadedState,
  getDashboardSettingsLoadingState
} from '../reducers/dashboard-settings.reducer';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { getRootState, State } from '../reducers';

export const getDashboardSettingsState = createSelector(getRootState, (state: State) => state.dashboardSettings);

export const getAllDashboardSettings = createSelector(getDashboardSettingsState, getAllDashboardSettingsState);

export const getDashboardSettings = createSelector(
  getAllDashboardSettings,
  (dashboardSettingsList: DashboardSettings[]) => dashboardSettingsList[0]
);

export const getDashboardSettingsLoaded = createSelector(getDashboardSettingsState, getDashboardSettingsLoadedState);

export const getDashboardSettingsLoading = createSelector(getDashboardSettingsState, getDashboardSettingsLoadingState);
