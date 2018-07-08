import { ActionReducerMap } from '@ngrx/store';
import {
  DashboardObjectState,
  dashboardObjectReducer
} from './dashboard.reducer';

export interface DashboardState {
  dashboardObject: DashboardObjectState;
}

export const dashboardReducer: ActionReducerMap<DashboardState> = {
  dashboardObject: dashboardObjectReducer
};
