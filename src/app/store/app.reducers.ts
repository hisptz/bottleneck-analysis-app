import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {storeFreeze} from 'ngrx-store-freeze';
import {RouterReducerState} from '@ngrx/router-store';
import * as RouterReducer from '@ngrx/router-store';
import {CurrentUserState} from './current-user/current-user.state';
import {currentUserReducer} from './current-user/current-user.reducer';
import {DashboardState} from './dashboard/dashboard.state';
import {dashboardReducer} from './dashboard/dashboard.reducer';
import {VisualizationState} from './visualization/visualization.state';
import {visualizationReducer} from './visualization/visualization.reducer';
import {DictionaryState} from '../modules/dictionary/store/dictionary.state';
import {dictionaryReducer} from '../modules/dictionary/store/dictionary.reducer';

export interface AppState {
  route: RouterReducerState;
  currentUser: CurrentUserState;
  dashboard: DashboardState;
  visualization: VisualizationState;
  metadataDictionary: DictionaryState[];
}

export const reducers: ActionReducerMap<AppState> = {
  route: RouterReducer.routerReducer,
  currentUser: currentUserReducer,
  dashboard: dashboardReducer,
  visualization: visualizationReducer,
  metadataDictionary: dictionaryReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
