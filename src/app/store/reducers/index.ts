import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { environment } from '../../../environments/environment';

import { userReducer, UserState } from './user.reducer';
import { systemInfoReducer, SystemInfoState } from './system-info.reducer';

import { LegendSetState, legendSetReducer } from './legend-set.reducer';

import * as fromDeterminantReducer from './determinant.reducer';
import { RootCauseData, rootCauseDataReducer } from './root-cause-data.reducer';

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
  legendSets: LegendSetState;
  determinant: fromDeterminantReducer.State;
  rootCauseData: RootCauseData;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  systemInfo: systemInfoReducer,
  route: routerReducer,
  legendSets: legendSetReducer,
  determinant: fromDeterminantReducer.reducer,
  rootCauseData: rootCauseDataReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

/**
 * Root state selector
 * @param {State} state
 * @returns {State} state
 */
export const getRootState = (state: State) => state;
