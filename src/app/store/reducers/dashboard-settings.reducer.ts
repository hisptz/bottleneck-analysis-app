import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  DashboardSettingsActions,
  DashboardSettingsActionTypes
} from '../actions';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';

export interface DashboardSettingsState extends EntityState<DashboardSettings> {
  loading: boolean;
  loaded: boolean;
}

const dashboardSettingsAdapter: EntityAdapter<
  DashboardSettings
> = createEntityAdapter<DashboardSettings>();

const initialState: DashboardSettingsState = dashboardSettingsAdapter.getInitialState(
  {
    // additional entity state properties
    loading: false,
    loaded: false
  }
);

export function dashboardSettingsReducer(
  state: DashboardSettingsState = initialState,
  action: DashboardSettingsActions
): DashboardSettingsState {
  switch (action.type) {
    case DashboardSettingsActionTypes.LoadDashboardSettings: {
      return { ...state, loading: true, loaded: false };
    }

    case DashboardSettingsActionTypes.AddDashboardSettings: {
      return action.dashboardSettings
        ? dashboardSettingsAdapter.addOne(action.dashboardSettings, {
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

export const getDashboardSettingsLoadedState = (
  state: DashboardSettingsState
) => state.loaded;

export const getDashboardSettingsLoadingState = (
  state: DashboardSettingsState
) => state.loading;

export const {
  selectAll: getAllDashboardSettingsState
} = dashboardSettingsAdapter.getSelectors();
