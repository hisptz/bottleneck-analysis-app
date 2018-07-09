import { ActionReducerMap } from '@ngrx/store';
import {
  DashboardObjectState,
  dashboardObjectReducer
} from './dashboard.reducer';

import {
  DashboardVisualizationState,
  dashboardVisualizationReducer
} from './dashboard-visualization.reducer';

export interface DashboardState {
  dashboardObject: DashboardObjectState;
  dashboardVisualization: DashboardVisualizationState;
}

export const dashboardReducer: ActionReducerMap<DashboardState> = {
  dashboardObject: dashboardObjectReducer,
  dashboardVisualization: dashboardVisualizationReducer
};
