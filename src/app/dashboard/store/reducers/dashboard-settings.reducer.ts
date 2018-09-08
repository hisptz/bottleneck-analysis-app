import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  DashboardSettingsActions,
  DashboardSettingsActionTypes
} from '../actions/dashboard-settings.action';
import { DashboardSettings } from '../../models/dashboard-settings.model';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<DashboardSettings> {
  loading: boolean;
  loaded: boolean;
}

const adapter: EntityAdapter<DashboardSettings> = createEntityAdapter<
  DashboardSettings
>();

const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false
});

export function reducer(
  state: State = initialState,
  action: DashboardSettingsActions
): State {
  switch (action.type) {
    case DashboardSettingsActionTypes.LoadDashboardSettings: {
      return { ...state, loading: true, loaded: false };
    }

    case DashboardSettingsActionTypes.AddDashboardSettings: {
      return action.dashboardSettings
        ? adapter.addOne(action.dashboardSettings, {
            ...state,
            loading: false,
            loaded: true
          })
        : {
            ...state,
            loading: false,
            loaded: true
          };
    }
  }
  return state;
}

export const getDashboardSettingsState = createFeatureSelector<State>(
  'dashboardSettings'
);

export const { selectAll: getAllDashboardSettings } = adapter.getSelectors(
  getDashboardSettingsState
);
