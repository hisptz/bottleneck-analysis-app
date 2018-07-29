import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
  DashboardObjectState,
  dashboardObjectReducer
} from './dashboard.reducer';

import {
  DashboardVisualizationState,
  dashboardVisualizationReducer
} from './dashboard-visualization.reducer';

import {
  DashboardSettingsState,
  dashboardSettingsReducer
} from './dashboard-settings.reducer';

export interface DashboardState {
  dashboardSettings: DashboardSettingsState;
  dashboardObject: DashboardObjectState;
  dashboardVisualization: DashboardVisualizationState;
}

export const dashboardReducer: ActionReducerMap<DashboardState> = {
  dashboardSettings: dashboardSettingsReducer,
  dashboardObject: dashboardObjectReducer,
  dashboardVisualization: dashboardVisualizationReducer
};

export const getDashboardState = createFeatureSelector<DashboardState>(
  'dashboard'
);
