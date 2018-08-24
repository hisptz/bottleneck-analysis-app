import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { environment } from '../../../environments/environment';

import { userReducer, UserState } from './user.reducer';
import { systemInfoReducer, SystemInfoState } from './system-info.reducer';
import { DashboardObjectState, dashboardObjectReducer } from './dashboard.reducer';
import { DashboardSettingsState, dashboardSettingsReducer } from './dashboard-settings.reducer';
import { DashboardVisualizationState, dashboardVisualizationReducer } from './dashboard-visualization.reducer';
import { DashboardGroupsState, dashboardGroupReducer } from './dashboard-groups.reducer';
import { LegendSetState, legendSetReducer } from './legend-set.reducer';

/**
 * Root state interface
 */
export interface State {
  /**
   * User state
   */
  user: UserState;

  /**
   * System info state
   */
  systemInfo: SystemInfoState;

  /**
   * Router state
   */
  route: RouterReducerState;
  dashboardObject: DashboardObjectState;
  dashboardGroups: DashboardGroupsState;
  dashboardSettings: DashboardSettingsState;
  dashboardVisualization: DashboardVisualizationState;
  legendSets: LegendSetState;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  systemInfo: systemInfoReducer,
  route: routerReducer,
  dashboardObject: dashboardObjectReducer,
  dashboardGroups: dashboardGroupReducer,
  dashboardSettings: dashboardSettingsReducer,
  dashboardVisualization: dashboardVisualizationReducer,
  legendSets: legendSetReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

/**
 * Root state selector
 * @param {State} state
 * @returns {State} state
 */
export const getRootState = (state: State) => state;
